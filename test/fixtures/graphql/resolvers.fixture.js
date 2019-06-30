const resolveFixture = {
  RootQuery: {
    greetings() {
      return new Promise((resolve, reject) => {
        setTimeout(
          resolve.bind(null, {
            message: "hello world"
          }),
          200
        )
      })
    }
  },
  HelloWorld: {
    message(greeting) {
      return greeting.message
    }
  }
}

export default resolveFixture
