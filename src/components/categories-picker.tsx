import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import Category from '../models/Category'
import OptionsValue from '../models/OptionsValue'

type Props = {
  categories: Category[]
  setTags: (values: OptionsValue[]) => void
  values?: OptionsValue[]
  loading: boolean
}

// https://react-select.com/styles

export default observer(({ categories, setTags, values, loading }: Props) => {
  const animatedComponents = makeAnimated()
  const [categoriesValues, SetCategoriesValues] = useState(values)

  useEffect(() => {
    SetCategoriesValues(values)
  }, [values])

  return (
    <>
      <Select
        isLoading={loading}
        defaultValue={categoriesValues}
        options={categories?.map(
          cat =>
            ({
              label: cat.name,
              value: cat.categoryId
            } as OptionsValue)
        )}
        styles={{
          multiValueLabel: base => ({
            ...base,
            backgroundColor: 'var(--accent)',
            color: 'white'
          }),
          input: base => ({
            ...base,
            boxShadow: 'none !important'
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
        onChange={(tag: OptionsValue[]) => {
          if (tag) {
            setTags(tag)
          } else {
            setTags([])
          }
        }}
      />

      {/* <style jsx>{``}</style> */}
    </>
  )
})
