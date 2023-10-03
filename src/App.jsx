import { useEffect, useRef, useState } from "react"


function Button({ className, children, onClick }) {
  return <button className={`button ${className} `} onClick={onClick}>{children}</button>
}

export default function App() {
  const initialFriends = [
    {
      id: 118836,
      name: "رمض",
      image: "ramez.jpg",
      balance: 70
    },
    {
      id: 933372,
      name: "ممد",
      image: "mamad.jpg",
      balance: -40
    }
    ,
    {
      id: 499476,
      name: "پارسا",
      image: "parsa.jpg",
      balance: 0
    }
  ]
  const [friends, setFreinds] = useState(function () {
    const storedValue = localStorage.getItem('friends')
    return JSON.parse(storedValue);
  })
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectFriend, setSelectFriend] = useState("")
  const [details, setDetails] = useState(false)
  const [show, setShow] = useState(false)
  const tempRef = useRef(0)
  const tempRef2 = useRef(0)
  function handleShow() {
    setShow(s => !s)
    tempRef.current = 1;
    if (show) {
      tempRef2.current=1
      setShowAddFriend(s => s ? !s : s)
    }
  }
  function handleShowAddFriend() {
    setShowAddFriend(s => !s)
    tempRef.current = 1
  }
  function handleAddFreind(friend) {
    setFreinds((freinds) => [...freinds, friend])
    setShowAddFriend(false)
  }
  function handleSelectFriend(friend) {
    setSelectFriend((selected) => friend.id === selected?.id ? "" : friend)
    setShowAddFriend(false)
    setDetails(false)
  }
  function handleSplitBill(value) {
    setFreinds((friends) => friends.map((el) => el.id === selectFriend.id ? { ...el, balance: el.balance + value } : el))
    setSelectFriend(null)
    setDetails(false)
  }
  function handleDetails() {
    setDetails(s => !s)
    setSelectFriend("")
  }
  function handleDelete(friend) {

    if (friend.name !== 'پارسا' && friend.name !== 'رمض' && friend.name !== 'ممد') {
      setFreinds(friends => friends.filter(el => el.id !== friend.id))
    }
  }
  useEffect(function () {
    localStorage.setItem('friends', JSON.stringify(friends))
  }, [friends])
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList tempRef2={tempRef2} show={show} handleShow={handleShow} onHandleDelete={handleDelete} handleDetails={handleDetails}
          friends={friends} selectFriend={selectFriend} onSelectFriend={handleSelectFriend} />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFreind} />}
        <Button className={`
        ${showAddFriend && show &&tempRef.current && 'show-animation'}
        ${!showAddFriend && !show &&tempRef.current && 'show-animation-up'}
        ${!showAddFriend && show && tempRef.current && 'show-animation-temp'}
        ${showAddFriend && !show && tempRef.current && 'show-animation'}
      `}
          onClick={handleShowAddFriend}>{!showAddFriend ? ' اضافه کردن رفیق' : 'بستن'}</Button>
      </div>
      {selectFriend && <FormSplitBill key={selectFriend.id} setSelectFriend={setSelectFriend} selectFriend={selectFriend} onSplitBill={handleSplitBill} />}
      {details && <Details />}
    </div>
  )
}

const FriendsList = ({ tempRef2, handleShow, show, friends, onSelectFriend, selectFriend, handleDetails, onHandleDelete }) => {

  return (
    <>
      <ul>
        {friends.map((friend, i) => (
          i < 1 && !show ? (<Friend onHandleDelete={onHandleDelete}
            handleDetails={handleDetails} friend={friend}
            key={friend.id} onSelectFriend={onSelectFriend}
            selectFriend={selectFriend} />) : show && (
              <Friend show={show} i={i} onHandleDelete={onHandleDelete}
                handleDetails={handleDetails} friend={friend}
                key={friend.id} onSelectFriend={onSelectFriend}
                selectFriend={selectFriend} />
            )))}
        <button className={`more ${show ? 'animation-list' : ""}
         ${!show && tempRef2.current && 'animation-list-up'}`} 
         onClick={handleShow}>{show ? 'کمتر' : 'بیشتر'}</button>
      </ul>

    </>

  )
}

function Details() {
  return (
    <h1>بیوگرافی</h1>
  )
}

const Friend = ({ show,i, friend, selectFriend, onSelectFriend, handleDetails, onHandleDelete }) => {
  const isSelected = selectFriend?.id === friend.id
  return (
    <li className={`${i >= 1 ? 'animation-list' : ''} ${isSelected ? `selected` : ""}`} >
      <img className={`${show && 'img-animition' }`} src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {
        friend.balance < 0 && <p className="red">
          به {friend.name} <span style={{ margin: "0 2px", fontWeight: "bold" }}>{String(friend.balance).slice(1)}</span> تومن بده کاری
        </p>
      }
      {
        friend.balance > 0 && <p className="green">
          {friend.name} <span style={{ margin: "0 2px", fontWeight: "bold" }}>{String(friend.balance)}</span>  تومن باید بده
        </p>
      }
      {
        friend.balance === 0 && <p >
          {friend.name} بی حساب
        </p>
      }
      <Button onClick={() => onSelectFriend(friend)}>{isSelected ? `ببند` : `انتخابش کن`}</Button>
      <button onClick={handleDetails} style={{ border: "none", backgroundColor: "inherit", cursor: "pointer", width: "100%", color: "#495057" }}>بیشتر بدانید</button>
      <button onClick={() => onHandleDelete(friend)} className="deelete-button" style={{}}>حذف</button>
    </li >


  )
}


function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48")
  function handleSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID()
    if (!name || !image) return;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0
    }
    onAddFriend(newFriend)
    setName('')
    setImage("https://i.pravatar.cc/48")
  }
  return <form className="form-add-friend" onSubmit={handleSubmit}>
    <label> اسم رفیق   👨🏼‍🤝‍👨🏼</label>
    <input type='text' onChange={(e) => setName(e.target.value)} value={name} />

    <label>بارگذاری تصویر👤</label>
    <input type='text' onChange={(e) => setImage(e.target.value)} value={image} />

    <Button>اضافش کن</Button>
  </form>
}

function FormSplitBill({ selectFriend, onSplitBill, setSelectFriend }) {
  const [bill, setBill] = useState("")
  const [paidByMe, setPaidByMe] = useState("")
  const paidByFriend = bill ? bill - paidByMe : ""
  const [whoIsPaying, setWhoIsPaying] = useState("me")
  const inputEl = useRef(null)
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByMe) return;
    onSplitBill(whoIsPaying === 'me' ? paidByFriend : -paidByMe)
  }
  useEffect(function () {
    function callback(e) {
      if (e.code === 'Escape') {
        setSelectFriend("")
      }
    }
    inputEl.current.focus();
    document.addEventListener('keydown', callback)
    return () => document.removeEventListener('keydown', callback)
  }, [])
  return <form className="form-split-bill" onSubmit={handleSubmit}>
    <h2>دنگ {selectFriend.name}</h2>

    <label>💵 صورت حساب</label>
    <input ref={inputEl} type='text' value={bill} onChange={(e) => setBill(Number(e.target.value))} />

    <label>🦁 خرج خودم</label>
    <input type='text' value={paidByMe} onChange={(e) => setPaidByMe(Number(e.target.value) > bill ? paidByMe : Number(e.target.value))} />

    <label>👨 خرج {selectFriend.name}</label>
    <input type='text' disabled value={paidByFriend} />

    <label>🤑 کی حساب کرد </label>
    <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
      <option value='me'>من</option>
      <option value='friend'>{selectFriend.name}</option>
    </select>

    <Button>تقسیم صورت حساب</Button>
  </form>
}

