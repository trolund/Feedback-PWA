/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prefer-stateless-function */
import React from 'react'

const List = <P extends object, L>(
  Component: React.ComponentType<P>,
  list: L[]
) =>
  class ListClassComponent extends React.Component<P> {
    render() {
      const { ...props } = this.props
      return (
        <ul>
          {list.map((item, index) => (
            <li key={index}>
              <Component {...(props as P)} />
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
  }

export default List
