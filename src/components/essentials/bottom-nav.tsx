import Link from 'next/link'
import { useContext, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Calendar,
  Home,
  CheckCircle,
  User,
  MoreHorizontal,
  HelpCircle
} from 'react-feather'
import rootStore from '../../stores/RootStore'

type LinkType = {
  title: string
  icon: JSX.Element
  href: string
  roles?: string[]
  requireCompanyConfirm: boolean
}

const BottomNav = () => {
  const { pathname } = useRouter()
  const {
    authStore: { isAdmin, isVAdmin, isFacilitator },
    settingStore: { showTitleInBottomNav, setBottombarVisable }
  } = useContext(rootStore)

  useEffect(() => {
    setBottombarVisable(true)
    return () => {
      setBottombarVisable(false)
    }
  }, [setBottombarVisable])

  const showItem = useCallback(
    (link: LinkType) =>
      (link.roles.includes('Admin') && isAdmin) ||
      (link.roles.includes('VAdmin') && isVAdmin) ||
      (link.roles.includes('Facilitator') && isFacilitator),
    [isAdmin, isFacilitator, isVAdmin]
  )

  const links: LinkType[] = [
    {
      title: 'Oversigt',
      icon: <Home />,
      href: '/home',
      requireCompanyConfirm: false
    },
    {
      title: 'Kalendar',
      icon: <Calendar />,
      href: '/calendar',
      requireCompanyConfirm: true
    },
    {
      title: 'Giv Tilbagemelding',
      icon: <CheckCircle />,
      href: '/feedback',
      requireCompanyConfirm: false
    },
    {
      title: 'Profil',
      icon: <User />,
      href: '/profile',
      requireCompanyConfirm: false
    },
    {
      title: 'Om Opino',
      icon: <HelpCircle />,
      href: '/aboute',
      roles: ['Facilitator'],
      requireCompanyConfirm: false
    },
    {
      title: 'Mere',
      icon: <MoreHorizontal />,
      href: '/more',
      roles: ['Admin', 'VAdmin'],
      requireCompanyConfirm: true
    }
  ]

  return (
    <nav>
      <div>
        {links.map(link => {
          if (link.roles !== undefined) {
            if (!showItem(link)) return <></>
          }
          // if (link.requireCompanyConfirm) {
          //   if (!user?.companyConfirmed) {
          //     return <></>
          //   }
          // }
          return (
            <Link href={link.href} key={link.title}>
              <a
                title={link.title}
                aria-label={link.title}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.icon}
                {showTitleInBottomNav && <p>{link.title}</p>}
              </a>
            </Link>
          )
        })}
      </div>

      <style jsx>{`
        nav {
          padding-bottom: env(safe-area-inset-bottom);
          width: 100%;
          height: calc(env(safe-area-inset-top) + 72px);
          background: var(--base);
          border-top: 1px solid var(--divider);
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          bottom: 0;
          transition: var(--transition-colors);
          z-index: 99999;
        }

        nav > div {
          width: 100%;
          max-width: 480px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        nav a {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        nav a :global(> svg) {
          width: 20px;
          height: 20px;
        }

        nav a:active,
        nav a:focus,
        nav a:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        nav a.active {
          color: var(--accent);
        }

        nav a p {
          position: absolute;
          display: block;
          font-size: 0.6rem;
          margin-top: 1.5rem;
        }
      `}</style>
    </nav>
  )
}

export default BottomNav
