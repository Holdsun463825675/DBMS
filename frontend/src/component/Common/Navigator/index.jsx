import React from 'react'
import {Navbar,Container,Nav,Button}  from 'react-bootstrap'

export default function Navigator() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">

       <Container>

        <Navbar.Brand href="#home">图书管理系统</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>

        <Button variant='outline-primary'> 登录 | 注册 </Button>
        
      </Container>
      
    
    </Navbar>
  )
}
