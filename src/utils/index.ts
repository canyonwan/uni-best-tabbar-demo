import { pages, subPackages, tabBar } from '@/pages.json'
import { isMp } from './platform'
import { IMenuButtonInfo } from '@/utils/types'

export const PROD_API = GLOBAL_ENV.PROD_API
export const DEV_API = GLOBAL_ENV.DEV_API

const getLastPage = () => {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包回报错，所以改用下面这个【虽然我加了src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/** 判断当前页面是否是tabbar页  */
export const getIsTabbar = () => {
  if (!tabBar) {
    return false
  }
  if (!tabBar.list.length) {
    // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
    return false
  }
  const lastPage = getLastPage()
  const currPath = lastPage.route
  return !!tabBar.list.find((e) => e.pagePath === currPath)
}

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 ‘/pages/login/index’
 * redirectPath 如 ‘/pages/demo/base/route-interceptor’
 */
export const currRoute = () => {
  const lastPage = getLastPage()
  const currRoute = (lastPage as any).$page
  // console.log('lastPage.$page:', currRoute)
  // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  // console.log('lastPage.$page.options:', currRoute.options)
  // console.log('lastPage.options:', (lastPage as any).options)
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute as { fullPath: string }
  // console.log(fullPath)
  // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return getUrlObj(fullPath)
}

const ensureDecodeURIComponent = (url: string) => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
  const [path, queryStr] = url.split('?')
  // console.log(path, queryStr)

  if (!queryStr) {
    return {
      path,
      query: {},
    }
  }
  const query: Record<string, string> = {}
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    // console.log(key, value)
    query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  })
  return { path, query }
}
/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'needLogin') => {
  // 这里处理主包
  const mainPages = [
    ...pages
      .filter((page) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ]
  // 这里处理分包
  const subPages: any[] = []
  subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj

    subPageObj.pages
      .filter((page) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...mainPages, ...subPages]
  // console.log(`getAllPages by ${key} result: `, result)
  return result
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = (): string[] => getAllPages('needLogin').map((page) => page.path)

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages: string[] = getAllPages('needLogin').map((page) => page.path)

/**
 * 根据微信小程序当前环境，判断应该获取的BaseUrl
 */
export const getEvnBaseUrl = () => {
  // 请求基准地址
  let baseUrl = import.meta.env.VITE_SERVER_BASEURL

  // 小程序端环境区分
  if (isMp) {
    const {
      miniProgram: { envVersion },
    } = uni.getAccountInfoSync()

    switch (envVersion) {
      case 'develop':
        baseUrl = DEV_API
        break
      case 'trial':
        baseUrl = DEV_API
        break
      case 'release':
        baseUrl = PROD_API
        break
    }
  }

  return baseUrl
}

/**
 * 根据微信小程序当前环境，判断应该获取的UPLOAD_BASEURL
 */
export const getEvnBaseUploadUrl = () => {
  // 请求基准地址
  let baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL

  // 小程序端环境区分
  if (isMp) {
    const {
      miniProgram: { envVersion },
    } = uni.getAccountInfoSync()

    switch (envVersion) {
      case 'develop':
        baseUploadUrl = `${DEV_API}/sys/common/upload`
        break
      case 'trial':
        baseUploadUrl = `${DEV_API}/sys/common/upload`
        break
      case 'release':
        baseUploadUrl = `${PROD_API}/sys/common/upload`
        break
    }
  }

  return baseUploadUrl
}

// 获取胶囊按钮的位置信息
export function useGetBoundingMenuButton() {
  const menuButtonInfo = uni.getStorageSync('MenuButtonInfo') as IMenuButtonInfo
  if (!menuButtonInfo) {
    const res = uni.getMenuButtonBoundingClientRect()
    uni.setStorageSync('MenuButtonInfo', res)
    return menuButtonInfo
  } else {
    return menuButtonInfo
  }
}

// 更新检测
export function useCheckUpdate() {
  if (uni.canIUse('getUpdateManager')) {
    const updateManager = uni.getUpdateManager()
    updateManager &&
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            uni.showModal({
              title: '更新提示',
              showCancel: false,
              content: '新版本已经准备就绪，是否需要重新启动应用？',
              success: (res) => {
                if (res.confirm) {
                  // uni.clearStorageSync() // 更新完成后刷新storage的数据
                  updateManager.applyUpdate()
                }
              },
            })
          })

          updateManager.onUpdateFailed(() => {
            uni
              .showModal({
                title: '已有新版本上线',
                content: '小程序自动更新失败，请删除该小程序后重新搜索打开哟~~~',
                showCancel: false,
              })
              .catch(() => {})
          })
        } else {
          // 没有更新
        }
      })
  } else {
    uni
      .showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请更新到最新的微信后再重试。',
        showCancel: false,
      })
      .catch(() => {})
  }
}
