import { useDispatch, useSelector } from "react-redux";
import { addUserPhotoAction, logoutAction } from "../store/user/userActions";
import { selectPhotos } from "../store/user/userSlice";
import { UserPhoto } from "../store/storeStates";
import { useState } from "react";

function Profile() {
  const dispatch = useDispatch();
  const userPhotos: UserPhoto[] = useSelector(selectPhotos) || [];
  const [dishName, setDishName] = useState<string>("icecream");
  const [mealtimeTag, setMealtimeTag] = useState<string>("dessert");
  const [cuisineTag, setCuisineTag] = useState<string>("american");
  const [flavorTag, setFlavorTag] = useState<string>("sweet");
  const [file, setFile] = useState<File | null>(null);
  
  const getUserPhotos = () => {
    if (userPhotos) {
      return userPhotos.map((photo: UserPhoto, index: number) => <img key={index} src={photo.photoUrl} alt="user uploaded" style={{ width: '100px', height: '100px' }} />)
    }
  }

  const handleAddPhoto = () => {
    if (file) {
      dispatch(addUserPhotoAction({
        file, 
        name: dishName, 
        tags: [cuisineTag, mealtimeTag, flavorTag]
      }))
    }
  }

  return (
    <div>
      <button onClick={() => dispatch(logoutAction())} style={{
        background: 'lightpink',
        padding: '10px',
        marginTop: '20px',
        color: 'black',
        border: '1px #ff1493 solid',
        cursor: 'pointer',
          }}>Logout</button>
      <p>Your photos</p>
      {getUserPhotos()}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <div>
        <p><u>Add a Food Photo</u></p>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
        </div>
        <div>
        <p>Dish name</p>
        <input type="text" value={dishName} onChange={(e) => setDishName(e.target.value)} />
        </div>
        <div>
        <p>Mealtime Tag</p>
        <select value={mealtimeTag} onChange={(e) => setMealtimeTag(e.target.value)}>
          <option value="">Select a Mealtime</option>
          <option value="breakfast">Breakfast</option>
          <option value="entree">Entree</option>
          <option value="dessert">Dessert</option>
          <option value="appetizer">Appetizer</option>
          <option value="snack">Snack</option>
        </select>
        </div>
        <div>
        <p>Cuisine Tag</p>
        <select value={cuisineTag} onChange={(e) => setCuisineTag(e.target.value)}>
          <option value="">Select a Cuisine</option>
          <option value="chinese">Chinese</option>
          <option value="american">American</option>
          <option value="indian">Indian</option>
          <option value="thai">Thai</option>
          <option value="mexican">Mexican</option>
          <option value="italian">Italian</option>
          <option value="greek">Greek</option>
          <option value="mediterranean">Mediterranean</option>
        </select>
        </div>
        <div>
        <p>Flavor Tag</p>
        <select value={flavorTag} onChange={(e) => setFlavorTag(e.target.value)}>
          <option value="">Select a Flavor</option>
          <option value="sweet">Sweet</option>
          <option value="savory">Savory</option>
          <option value="spicy">Spicy</option>
          <option value="sour">Sour</option>
        </select>
        </div>
      
      <button style={{
        background: !file || !flavorTag || !mealtimeTag || !cuisineTag || !dishName ? '#f5e8ea' : 'lightpink',
        width: '50px',
        height: '30px',
        padding: '5px',
        marginTop: '20px',
        color: 'black',
        border: 'none',
        cursor: 'pointer',
          }} disabled={!file || !flavorTag || !mealtimeTag || !cuisineTag || !dishName} onClick={handleAddPhoto}>Add</button>
      </div>
    </div>
  )
}

export default Profile;