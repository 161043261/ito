import styled from 'styled-components';

const BgContainer = styled.div`
  background: var(--color-green5);
  width: 100vw;
  height: 100vh;
`;

const Home: React.FC = () => {
  return (
    <BgContainer>
      <main>Homepage</main>
    </BgContainer>
  );
};

export default Home;
