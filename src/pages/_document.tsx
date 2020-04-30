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
                window.isLight = false
                try {
                  const isLight = window.localStorage.getItem('light-mode')
                  if (isLight) {
                    document.querySelector('html').className = 'light'
                    window.isLight = true
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
