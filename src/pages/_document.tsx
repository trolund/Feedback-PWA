import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from 'next/document'
import { resetServerContext } from 'react-beautiful-dnd'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    resetServerContext()
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang='en'>
        <Head />
        <body>
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
                window.isDark = false
                try {
                  const isDark = window.localStorage.getItem('light-mode')
                  if (isDark) {
                    document.querySelector('html').className = 'dark'
                    window.isDark = true
                  }
                } catch (err) {}
            `
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
export default MyDocument
