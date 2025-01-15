function Home(props: {userId: string | null}) {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome, {props.userId}</p>
    </div>
  )
}

export default Home