import { observer } from 'mobx-react-lite'
import { ChevronRight } from 'react-feather'
import Link from 'next/link'
import Page from '../components/page'
import Section from '../components/section'
import withAuth from '../services/withAuth'

type LinkType = {
  title: string
  href: string
}

const links: LinkType[] = [
  {
    title: 'Bruger administration',
    href: '/user-admin'
  },
  {
    title: 'Spørgsmåls sæt',
    href: '/questionsets'
  },
  {
    title: 'Indstillinger',
    href: '/settings'
  }
]

const More = withAuth(
  observer(() => {
    return (
      <Page title='Flere' showBackButton={false}>
        <Section>
          <ul>
            {links.map(item => (
              <Link href={item.href}>
                <li>
                  <p className='text'>{item.title}</p>
                  <div className='arrow'>
                    <ChevronRight />
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </Section>
        <style jsx>{`
          .text {
            width: inherit;
          }

          .arrow {
            float: right;
            display: inline-block;
            white-space: nowrap;
          }
          .label {
            display: block;
            width: 100%;
          }
          .info {
            width: 100%;
          }
          li {
            cursor: pointer;
            color: var(--fg);
            padding: var(--gap-small);
            background: var(--base);
            display: flex;
            align-items: center;
            transition: var(--transition-colors);
            width: 100%;
            border-bottom: 1px solid var(--divider);
          }

          li:hover {
            background: var(--devider);
          }

          h4 {
            color: var(--fg);
            margin-left: var(--gap-small);
            font-weight: 500;
            letter-spacing: 0.0035em;
          }
        `}</style>
      </Page>
    )
  })
)

export default More
