import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { Save } from 'react-feather'
import UserAdmin from '../../models/user-admin'
import Page from '../../components/essentials/page'
import Section from '../../components/essentials/section'
import userAdminQuery from '../../models/userAdminQuery'
import FetchStates from '../../stores/requestState'
import CustomCheckbox from '../../components/Input/checkbox'
import withAuth from '../../components/hoc/withAuth'
import rootStore from '../../stores/RootStore'

const AllQuestionSets = withAuth(
  observer(() => {
    const [list, setList] = useState([] as UserAdmin[])
    const [query, setQuery] = useState({} as userAdminQuery)
    const { userAdminStore } = useContext(rootStore)

    useEffect(() => {
      userAdminStore.fetchUsers(query).then(res => {
        if (res === FetchStates.DONE) {
          setList(userAdminStore.users)
        }
      })
    }, [userAdminStore, query])

    const saveClickHandler = () => {
      userAdminStore.updateUsers(list.filter(u => u.modifyed === true))
    }

    const updateDelete = (value: boolean, index: number) => {
      const newarr = [...list]
      newarr[index].delete = value
      newarr[index].modifyed = true
      setList([...newarr])
    }

    const updateCompanyConfirm = (value: boolean, index: number) => {
      const newarr = [...list]
      newarr[index].companyConfirmed = value
      newarr[index].modifyed = true
      setList([...newarr])
    }

    return (
      <Page
        title='Bruger administration'
        component={
          <button type='button' onClick={saveClickHandler}>
            <Save /> Gem
          </button>
        }
      >
        <Section>
          <div>
            <input
              type='text'
              className='filter'
              placeholder='word'
              value={query?.searchword}
              onChange={e =>
                setQuery({
                  ...query,
                  searchword: e.target.value
                } as userAdminQuery)
              }
            />
          </div>
          <Table>
            <Thead>
              <Tr className='tableheader'>
                <Th>Virksomheds ID</Th>
                <Th>Bekræftet virksomhed</Th>
                <Th>Navn</Th>
                <Th>Telefon nr.</Th>
                <Th>Email</Th>
                <Th>Slet</Th>
              </Tr>
            </Thead>
            <Tbody>
              {list?.map((item, index) => (
                <Tr
                  data-userid={item.userId}
                  key={item.userId}
                  className='item'
                >
                  <Td>{item.companyId}</Td>
                  <Td>
                    <CustomCheckbox
                      label=''
                      noLabel
                      checked={item.companyConfirmed}
                      onChange={e => updateCompanyConfirm(e, index)}
                    />
                  </Td>
                  <Td>{`${item.firstname} ${item.lastname}`}</Td>
                  <Td>{item.phoneNumber}</Td>
                  <Td>{item.email}</Td>
                  <Td>
                    <CustomCheckbox
                      label=''
                      noLabel
                      checked={item.delete}
                      onChange={e => updateDelete(e, index)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Section>
        <style jsx>{`
          @media only screen and (max-width: 400px) {
            .name {
              margin-right: auto;
              margin-left: auto;
              text-align: center;
              float: none;
            }

            .topbar {
              float: none;
            }
          }

          .filter {
            width: 100%;
            margin-bottom: 50px;
          }

          .topbar {
            width: 100%;
            padding: 10px;
            height: calc(2vw * 20);
            max-height: 120px;
          }
        `}</style>
        <style jsx global>{`
          .item {
            text-align: justify !important;
            color: var(--fg);
            padding: var(--gap-small);
            background: var(--base);
            align-items: center;
            transition: var(--transition-colors);
            margin-bottom: 10px;
          }

          .tableheader {
            text-align: left;
          }

          .item:not(:last-child) {
            border-bottom: 1px solid var(--divider);
          }
        `}</style>
      </Page>
    )
  })
)

// AllQuestionSets.getInitialProps = async ctx => {
//   const { jwttoken } = cookies(ctx)
//   const url = ApiRoutes.QuestionSetNames
//   let data: QuestionSet[] | null = null
//   try {
//     const response = await fetch(url, {
//       headers: !jwttoken ? {} : { Authorization: `Bearer ${jwttoken}` }
//     })
//     data = await response.json()
//   } catch (e) {
//     console.error(e)
//   }
//   return {
//     initPageProps: data
//   }
// }

export default AllQuestionSets
