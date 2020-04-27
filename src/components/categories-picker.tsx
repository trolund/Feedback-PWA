/* eslint-disable jsx-a11y/control-has-associated-label */
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import Modal from 'react-modal'
import { observer } from 'mobx-react-lite'
import { ChevronDown, X } from 'react-feather'
import { useState, useEffect, useCallback } from 'react'
import Category from '../models/Category'
import IOptionsValue from '../models/OptionsValue'
import CustomCheckbox from './checkbox'

type Props = {
  categories: Category[]
  setTags: (values: IOptionsValue[]) => void
  values: IOptionsValue[]
  loading: boolean
  center?: boolean
  error?: boolean
  fill?: boolean
}

// https://react-select.com/styles

export default observer(
  ({ categories, setTags, values, loading, center, fill, error }: Props) => {
    const swapPoint = 800
    const animatedComponents = makeAnimated()
    const [categoriesValues, SetCategoriesValues] = useState(values)
    const [showModal, setShowModal] = useState(false)
    const [wWidth, setWWidth] = useState(0)

    const [tempDataList, settempDataList] = useState([] as IOptionsValue[])

    useEffect(() => {
      setWWidth(window.innerWidth)
      window.addEventListener('resize', () => setWWidth(window.innerWidth))
      return window.removeEventListener('resize', () =>
        setWWidth(window.innerWidth)
      )
    }, [])

    // const showOverlay = () => {
    //   overlay.className = 'categories-overlay'
    // }

    // const hideOverlay = () => {
    //   overlay.className = 'displaynone'
    // }

    // useEffect(() => {
    //   if (showModal) {
    //     showOverlay()
    //   } else {
    //     hideOverlay()
    //   }
    // }, [showModal])

    useEffect(() => {
      SetCategoriesValues(values)
      settempDataList(values)
    }, [values])

    const val = useCallback(
      (item: Category) => {
        return (
          categoriesValues?.filter(i => i?.value === item?.categoryId).length >=
          0
        )
      },
      [categoriesValues]
    )

    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
      }
    }

    const fillSpace = fill ? { width: '100%' } : { width: 'fit-content' }

    return (
      <>
        {wWidth > swapPoint ? (
          <Select
            isLoading={loading}
            defaultValue={categoriesValues}
            options={categories?.map(
              cat =>
                ({
                  label: cat.name,
                  value: cat.categoryId
                } as IOptionsValue)
            )}
            styles={{
              container: base => ({
                ...base,
                width: '100%'
              }),
              multiValueLabel: base => ({
                ...base,
                backgroundColor: 'var(--accent)',
                color: 'white'
              }),
              input: base => ({
                ...base,
                boxShadow: 'none !important',
                width: '100%'
              }),
              control: base => ({
                ...base,
                background: 'var(--surface)',
                border: 'none',
                padding: '7px'
              }),
              multiValueRemove: base => ({
                ...base,
                background: 'var(--accent)'
              }),
              multiValue: base => ({
                ...base,
                background: 'var(--accent)'
              })
            }}
            theme={theme => ({
              ...theme,
              borderRadius: 15,

              colors: {
                ...theme.colors,
                primary: 'var(--accent)',
                neutral0: 'var(--base)'
              }
            })}
            isMulti
            components={animatedComponents}
            // defaultValue={['var(--text)']}
            onChange={(tag: IOptionsValue[]) => {
              if (tag) {
                setTags(tag)
              } else {
                setTags([])
              }
            }}
          />
        ) : (
          <>
            <div
              className='select-css'
              style={{
                ...fillSpace,
                textAlign: center ? 'center' : 'left',
                boxShadow: error ? '0 0 0 2px var(--error) !important' : 'none'
              }}
              role='button'
              tabIndex={0}
              onKeyPress={() => setShowModal(!showModal)}
              onClick={() => setShowModal(!showModal)}
            >
              <div style={{ width: '100%' }}>categories</div>
              <span className='arrow'>
                <ChevronDown />
              </span>
            </div>
            {showModal && (
              <Modal
                isOpen={showModal}
                // onAfterOpen={afterOpenModal}
                onRequestClose={() => setShowModal(false)}
                style={customStyles}
                contentLabel='Example Modal'
                className='Modal'
                overlayClassName='Overlay'
                ariaHideApp={false} // TODO fjern dette og fix fejl
              >
                <X
                  type='button'
                  className='close-modal'
                  onClick={() => setShowModal(false)}
                />
                <h4>Vælg kategorier</h4>
                <ul>
                  {categories?.map(item => (
                    <li key={item.categoryId}>
                      <CustomCheckbox
                        label={item.name}
                        checked={
                          values.filter(i => i.value === item.categoryId)
                            .length > 0
                        }
                        onChange={boolean => {
                          if (boolean) {
                            setTags([
                              ...values,
                              {
                                label: item.name,
                                value: item.categoryId
                              } as IOptionsValue
                            ])
                          } else {
                            setTags(
                              tempDataList.filter(
                                x => x?.value !== item?.categoryId
                              )
                            )
                          }
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </Modal>
            )}
          </>
        )}

        <style jsx>{`
          .modal-container {
            min-width: 100vw;
            height: 350px;
            background-color: var(--base);
            position: fixed;
            bottom: 0;
            z-index: 9999999;
            left: 0;
          }

          .arrow {
            float: right;
            margin-left: -28px;
            margin-top: 3px;
            z-index: 1;
          }
          .select-css {
            z-index: 10;
            display: block;
            color: #444;
            line-height: 1.3;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            margin: 0;
            border: 1px;
            width: 100%;
            padding: var(--gap-small);

            /* box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04); */

            appearance: none;
            border: 0px !important;
            color: var(--text);
            background: var(--base);
            display: flex;
            align-items: center;
            transition: var(--transition-colors);
            border-color: var(--divider);
            border-radius: var(--border-radius);
            background-color: var(--surface);
            display: -ms-flexbox;
            /* IE10 */
            display: flex;
            font-size: inherit;
            font-family: inherit;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
              rgba(0, 0, 0, 0.06) 0px 1px 2px 0px !important;
            -webkit-appearance: none;
            margin: 0px;
            border-width: 0px;
            border-style: initial;
            border-color: initial;
          }

          .select-css select {
            width: 100%;
            padding: 15px;
          }

          .select-css::-ms-expand {
            display: none;
          }

          .select-css:hover {
            border-color: #888;
          }

           {
            /* .select-css:focus {
          border-color: #aaa;
          box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
          box-shadow: 0 0 0 3px -moz-mac-focusring;
          color: #222;
          outline: none;
        } */
          }

          .select-css option {
             {
              /* font-weight: normal; */
            }
          }

          /* Support for rtl text, explicit support for Arabic and Hebrew */
          *[dir='rtl'] .select-css,
          :root:lang(ar) .select-css,
          :root:lang(iw) .select-css {
            background-position: left 0.7em top 50%, 0 0;
            padding: 0.6em 0.8em 0.5em 1.4em;
          }

          .select-css:disabled:hover,
          .select-css[aria-disabled='true'] {
            border-color: #aaa;
          }

          .select-css select:focus {
            background-color: none;
            border-radius: var(--border-radius);
            outline: 0px;
            box-sizing: border-box;
            box-shadow: 0 0 0 2px var(--accent);
          }
        `}</style>
      </>
    )
  }
)
