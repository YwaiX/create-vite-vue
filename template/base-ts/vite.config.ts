import vue from '@vitejs/plugin-vue'
import os from 'os'
import path from 'path'
import { defineConfig, ViteDevServer } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    bannerPlugin()
  ],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
  },
  build: {
    rolldownOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || ''
          if (fileName.endsWith('.css')) {
            return 'css/[name]-[hash].css'
          }
          const imgExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico']
          if (imgExts.some(ext => fileName.endsWith(ext))) {
            return 'images/[name]-[hash].[ext]'
          }
          return 'assets/[name]-[hash].[ext]'
        },
        manualChunks (id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      }
    }
  },
	server: {
		host: '0.0.0.0',
		port: 20000,
		strictPort: false,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
})

// ✅ 自定义 Banner 插件
export function bannerPlugin () {
  return {
    name: 'vite-banner',
    configureServer (server: ViteDevServer) {
      // 延迟一点确保端口已分配
      setTimeout(() => {
        const config = server.config
        const { port, host = 'localhost', https = false } = config.server || {}
        const protocol = https ? 'https' : 'http'
        const projectName = path.basename(config.root)

        const localHost = host === '0.0.0.0' ? 'localhost' : host
        const localUrl = `${protocol}://${localHost}:${port}`

        const networkUrls = []
        if (host === '0.0.0.0') {
          const interfaces = os.networkInterfaces()
          for (const name in interfaces) {
						const netList = interfaces[name]
						if (!netList) continue
						for (const iface of netList) {
							if (iface.family === 'IPv4' && !iface.internal) {
								networkUrls.push(`${protocol}://${iface.address}:${port}`)
							}
						}
					}
        }

        console.log(`
  __  __ ______ ______ _______ 
 |  \\/  |  ____|  ____|__   __|
 | \\  / | |__  | |__     | |   
 | |\\/| |  __| |  __|    | |   
 | |  | | |____| |____   | |   
 |_|  |_|______|______|  |_|   
✨ 项目名称: ${projectName}
🚀 本地访问: ${localUrl}`)

        if (networkUrls.length > 0) {
          networkUrls.forEach(url => console.log(`📡 网络访问: ${url}`))
        } else if (host === '0.0.0.0') {
          console.log('   未检测到有效网络地址')
        } else {
          console.log('   仅限本地访问')
        }

        console.log('\n')
      }, 200)
    }
  }
}

// 获取局域网 IP（可选）
export function getNetworkAddress () {
	const addresses: string[] = []
	const interfaces = os.networkInterfaces()

	// 安全遍历：过滤掉 undefined 值并类型守卫
	Object.values(interfaces)
		.filter((list): list is os.NetworkInterfaceInfo[] => Array.isArray(list))
		.flat()
		.forEach((iface) => {
			if (iface.family === 'IPv4' && !iface.internal && iface.address) {
				addresses.push(iface.address)
			}
		})

	return addresses
}
