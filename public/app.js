var React     = require('react');
var ReactDOM  = require('react-dom');
var createStore =  require('redux').createStore;
var Provider    =  require('react-redux').Provider;
var connect   = require('react-redux').connect;

function globalReducer(state={playerCount: 0, playerList:[]}, action) {
  if(action.type == 'playerAddList') {
    var newPlayerList = state.playerList.concat([action.playerName]);
    return {playerCount: state.playerCount, playerList: newPlayerList };
  } else if(action.type == 'playerAddCount')  {
    return {playerCount: state.playerCount + 1 , playerList: state.playerList };
  } else {
    return state;
  }
}

if(saveStore != null) {
  var store = createStore(globalReducer, saveStore);
} else {
  var store = createStore(globalReducer);
}
function handleChange() {
  console.log(store.getState());
  var data = JSON.stringify(store.getState());
  fetch('./saveApp?storeState='+data);
}
store.subscribe(handleChange);

class PlayerAdd extends React.Component {
  
  constructor() {
    super();
    this.handleChange     = this.handleChange.bind(this);
    this.handleSubmit     = this.handleSubmit.bind(this);
    this.state = {};
  }
  
  handleChange(event) {
    console.log(event.target.value);
    this.setState({playerName: event.target.value});
  }
  
  handleSubmit(event) {
    event.preventDefault();
    this.props.onHandleSubmit(this.state.playerName);
  }
  
  render() {

    return(
      <div className="col-xs-6">
        <div className="form-signin">
          <form onSubmit={this.handleSubmit}>
            <label className="sr-only">Player name</label>
            <input onChange={this.handleChange} type="text" id="player" className="form-control" placeholder="player name" />

            <input id="valider" className="btn btn-warning  btn-lg btn-block" value="Add Player" type="submit" />
          </form>
        </div>
      </div>
     )
  }
}  

function mapDispatchToProps(dispatch) {
  return {
    onHandleSubmit: function(name) {
      dispatch( {type: 'playerAddList', playerName: name} ); 
      dispatch( {type: 'playerAddCount'} );
    }
  }
}

var PlayerAddRedux = connect(
    null, 
    mapDispatchToProps
)(PlayerAdd);


class PlayerList extends React.Component {
 
  render() {
    
   var players = [];     
   for(var i=0; i<this.props.playerList.length; i++) {
   players.push(<li className="list-group-item">{this.props.playerList[i]}</li>);
   }   
       
    
    
    return(
      <div className="col-xs-offset-1 col-xs-5">
        <h2 className="form-signin-heading">{this.props.playerCount} player(s)</h2>
        <ul className="list-group">
         {players}
        </ul>
      </div>
     )
  }
}


function mapStateToProps(state) {
  return {
    playerCount: state.playerCount,
    playerList: state.playerList
  }
}

var PlayerListRedux = connect(
    mapStateToProps, 
    null
)(PlayerList);


ReactDOM.render(  
  <Provider store={store}>
    <div className="row">
      <PlayerAddRedux/>
      <PlayerListRedux/>
    </div>
  </Provider>
  ,
  document.getElementById('container')
);