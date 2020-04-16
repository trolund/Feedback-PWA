import Page from '../components/page'
import Section from '../components/section'
import UserList from '../components/fake-list'
import User from '../models/User'

const Tasks = () => {
  const dummyList: User[] = [
    {
      companyId: 1,
      firstname: 'Troels',
      lastname: 'Lund',
      roles: ['Admin', 'VAdmin']
    },
    {
      companyId: 1,
      firstname: 'Emil',
      lastname: 'Lund',
      roles: ['Admin']
    }
  ]

  return (
    <Page title='Tasks' showBackButton={false}>
      <Section>
        <h2>Tasks</h2>
      </Section>

      <UserList userlist={dummyList} />
    </Page>
  )
}

export default Tasks
