import fs from 'fs'
import path from 'path'
import Page from '../../components/page'
import Section from '../../components/section'

type abouteprops = {
  content: string
}

const Aboute = ({ content }: abouteprops) => {
  return (
    <Page title='Om appen' showBottomNav={false} showBackButton>
      <Section>{content}</Section>
      <style jsx>{`
        .container {
          position: absolute;
          left: 0;
          right: 0;
          padding-top: 50px;
          position: absolute;
          min-width: 100%;
          min-height: 100%;
        }

        .cam-view section div {
          box-shadow: rgba(0, 255, 0, 0.5) 0px 0px 0px 5px inset !important;
        }
      `}</style>
    </Page>
  )
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'static/content.txt')
  console.log(postsDirectory)

  const filenames = fs.readdirSync(postsDirectory)

  const content = filenames.map(filename => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')

    // Generally you would parse/transform the contents
    // For example you can transform markdown to HTML here

    return {
      filename,
      content: fileContents
    }
  })
  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    content
  }
}

export default Aboute
