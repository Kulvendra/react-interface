import { render } from '@testing-library/react';
import React, { Component } from 'react';
import '../css/App.css';
import AddAppointment from './AddAppointment'
import ListAppointment from './ListAppointment'
import SearchAppointment from './SearchAppointment'
import {findIndex, thru, without} from 'lodash';

class App extends Component{

  constructor(){
    super();
    this.state={
      myAppointments : [],
      formDisplay:false,
      orderBy:'petName',
      orderDir:'asc',
      queryText:'',
      lastIndex:0
    }
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addNewAppointment = this.addNewAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.requestQuery = this.requestQuery.bind(this);
    this.updateInfo=this.updateInfo.bind(this);
    }

  deleteAppointment(apts){
        let myApts = this.state.myAppointments;
        const updatedAptd = without(myApts,apts);
        this.setState({
          myAppointments:updatedAptd
        });
  }

  toggleForm(){
    this.setState({
      formDisplay:!this.state.formDisplay
    })

  }

  addNewAppointment(apts){
    const temp = this.state.myAppointments;
    apts.aptId = this.state.lastIndex;
    temp.unshift(apts);
    this.setState({
      myAppointments:temp,
      lastIndex:this.state.lastIndex+1
    })
  }

  changeOrder(order,dir){
      this.setState({
        orderBy:order,
        orderDir:dir
      })

  }

  requestQuery(e){
      const value = e.target.value;
      this.setState({
        queryText:value
      })
  }
  
  updateInfo(name,updatedText,id){
        let temp = this.state.myAppointments;
        let aptIndex = findIndex(this.state.myAppointments,{
          aptId:id
        });
        temp[aptIndex][name] = updatedText;
        this.setState({
          myAppointments:temp
        })

  }
  
  componentDidMount(){

    fetch('./data.json')
    .then(response => response.json())
    .then(result => {
      const apts = result.map(item =>{
        item.aptId = this.state.lastIndex;
        this.setState({lastIndex: this.state.lastIndex+1});
        return item;
      })

      this.setState({
        myAppointments:apts
      })

    })
  }

  render(){

    let order;
    let filteredApts =this.state.myAppointments;
    if(this.state.orderDir ==='asc'){
      order=1
    }else{
      order=-1
    }

    filteredApts = filteredApts.sort((a,b)=>{
      if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()){
        return -1*order;
      }else{
        return 1*order;
      }
    }).filter(eachItem =>{
      return(
        eachItem['petName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes'].toLowerCase().includes(this.state.queryText.toLowerCase()) 
      )
    })


    return (
      <main className="page bg-red" id="petratings">
      <div className="container">
        <div className="row">
          <div className="col-md-12 bg-white">
            <div className="container">
              <AddAppointment  formDisplay={this.state.formDisplay} toggleForm={this.toggleForm} addNewAppointment={this.addNewAppointment}/>
              <SearchAppointment orderBy={this.state.orderBy} orderDir={this.state.orderDir} changeOrder={this.changeOrder} requestQuery={this.requestQuery}/>
              <ListAppointment appointments={filteredApts} deleteAppointment={this.deleteAppointment} updateInfo={this.updateInfo}/>
             
            </div>
          </div>
        </div>
      </div>
    </main>
    );
  }
}



export default App;
