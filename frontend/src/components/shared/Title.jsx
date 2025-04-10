import React from 'react'

const Title = ({title="Chat App",description="This is the Chat App called Chattu",}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description}/>
    </>
  )
}

export default Title
