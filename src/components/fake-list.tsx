import { User as UserIcon, UserMinus } from 'react-feather'
import IUser from '../models/User'

type UserList = {
  userlist: IUser[]
}

const UserList: React.FC<UserList> = ({ userlist }) => {
  return (
    <ul>
      {userlist.map(item => (
        <li key={item.token}>
          {/* <Avatar>{item}</Avatar> */}
          <UserIcon />
          <h4>{item.firstname}</h4>
          <h4>{item.lastname}</h4>
          <h4>{item.companyId}</h4>
          <UserMinus />
          <UserMinus />
        </li>
      ))}

      <style jsx>{`
        li {
          color: var(--fg);
          padding: var(--gap-small);
          background: var(--base);
          display: flex;
          align-items: center;
          transition: var(--transition-colors);
        }

        li:not(:last-child) {
          border-bottom: 1px solid var(--divider);
        }

        h4 {
          color: var(--fg);
          margin-left: var(--gap-small);
          font-weight: 500;
          letter-spacing: 0.0035em;
        }
      `}</style>
    </ul>
  )
}

export default UserList
