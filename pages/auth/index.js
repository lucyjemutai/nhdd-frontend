export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}

const AuthIndex = () => null;

export default AuthIndex;
