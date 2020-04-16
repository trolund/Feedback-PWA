type Props = {
  children: React.ReactNode
}

const Section = ({ children }: Props) => (
  <section>
    {children}

    <style jsx>{`
      @media only screen and (max-width: 450px) {
        section {
          padding: 5px !important;
        }
      }
      section {
        padding: var(--gap);
      }
    `}</style>
  </section>
)

export default Section
