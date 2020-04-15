type Props = {
  children: React.ReactNode
}

const Section = ({ children }: Props) => (
  <section>
    {children}

    <style jsx>{`
      @media only screen and (max-width: 600px) {
        section {
          padding: 0px !important;
        }
      }
      section {
        padding: var(--gap);
      }
    `}</style>
  </section>
)

export default Section
