import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
      
    this.state = {
      showUsersContainer: true,
      showAddForm: false,
      users: [],
      name: "",
      email: "",
      editId: 0,
      edit: false
    };

    this.handleShowAddForm = this.handleShowAddForm.bind(this);
    this.handleUsersContainer = this.handleUsersContainer.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowEditForm = this.handleShowEditForm.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        this.setState({
          users: response.data
        });
      });
  }
  
  handleShowAddForm() {
    this.setState({
      showAddForm: true,
      showUsersContainer: false
    });
  }

  handleUsersContainer() {
    this.setState({
      showAddForm: false,
      showUsersContainer: true
    });
  }

  handleName(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    let data = {
      name: this.state.name,
      email: this.state.email
    };

    if (this.state.edit) {
      axios
        .put('https://jsonplaceholder.typicode.com/users/' + this.state.editId, data)
        .then(response => {
          if (response.status === 200) {
            alert('User successfully updated.');
          }
          this.handleUsersContainer();
        });
    } else {
      axios
        .post('https://jsonplaceholder.typicode.com/users', data)
        .then(response => {
          if (response.status === 201) {
            alert('User successfully added.');
          }
          this.handleUsersContainer();
        });
    }
  }

  handleShowEditForm(id, name, email) {
    this.setState({
      showAddForm: true,
      showUsersContainer: false,
      name,
      email,
      edit: true,
      editId: id
    });
  }

  handleDelete(id) {
    axios
      .delete('https://jsonplaceholder.typicode.com/users/' + id)
      .then(response => {
        if (response.status === 200) {
          alert('User successfully deleted.');
        }
      })
  }  

  render() {
    const { users, name, email, showUsersContainer, showAddForm, edit } = this.state;

    return (
      <div>
        { showAddForm &&
          <form className="add-form" onSubmit={this.handleSubmit}>
            <button className="back-btn" onClick={this.handleUsersContainer}>Back</button>
            <h2>{edit ? 'Edit' : 'Add'} User</h2>
            <input className="input" type="text" value={name} onChange={this.handleName} placeholder="Name" />
            <input className="input" type="text" value={email} onChange={this.handleEmail} placeholder="Email" />
            <input className="submit-btn" type="submit" value={edit ? 'Update' : 'Save'} />
          </form>
        }
        { showUsersContainer &&
          <div className="users-container">
            <h1 className="title">Users</h1>        
            <ul className="user-list">
              <li>
                <button className="add-btn" onClick={this.handleShowAddForm}>Add User</button>
              </li>
              {
                users.map(item => {
                  return (
                    <li key={item.id}>
                      <span className="name"><b>{item.name}</b> - {item.email}</span>
                      <button className="edit-btn" onClick={() => this.handleShowEditForm(item.id, item.name, item.email)}>Edit</button>
                      <button className="delete-btn" onClick={() => this.handleDelete(item.id)}>Delete</button>
                    </li>
                  )
                })
              }
            </ul>
          </div> 
        }
      </div>
    );
  }
}

export default App;