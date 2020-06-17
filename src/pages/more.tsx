import { observer } from 'mobx-react'
import { ChevronRight } from 'react-feather'
import Link from 'next/link'
import Page from '../components/essentials/page'
import Section from '../components/essentials/section'
import withAuth from '../components/hoc/withAuth'
import Roles from '../models/enums/roles'

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
    title: 'Spørgsmålssæt',
    href: '/questionsets'
  },
  // {
  //   title: 'Kategorier',
  //   href: '/categories'
  // },
  {
    title: 'Indstillinger',
    href: '/settings'
  },
  {
    title: 'Om Opino',
    href: '/aboute'
  }
]

const More = withAuth(
  observer(() => {
    return (
      <Page title='Flere' showBackButton={false}>
        <Section>
          <ul>
            {links.map(item => (
              <Link href={item.href} key={item.href}>
                <li data-cy={item.href}>
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
  }),
  [Roles.ADMIN, Roles.VADMIN]
)

export default More
