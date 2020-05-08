type Props = {
  children: React.ReactNode
}

const Section = ({ children }: Props) => (
  <section>
    {children}

    <style jsx>{`
      @media only screen and (max-width: 450px) {
        section {
          padding: var(--gap-small) !important;
        }
      }
      section {
        padding: var(--gap);
      }
    `}</style>
  </section>
)

export default Section
