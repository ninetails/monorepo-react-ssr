const { join } = require('path')

module.exports = {
  name: 'Monorepo React SSR',
  short_name: 'monoressr',
  description: 'Example of Progressive Web App with React and SSR',
  start_url: '/?utm_source=homescreen',
  theme_color: '#333333',
  background_color: '#ffffff',
  crossorigin: 'use-credentials',
  icons: [
    {
      src: join(__dirname, 'public', 'icon.png'),
      sizes: [72, 96, 120, 128, 144, 152, 180, 192, 384, 512, 1024]
    }
  ]
}
