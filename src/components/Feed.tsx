import { useDispatch, useSelector } from "react-redux"
import { selectFeed, selectFeedIdx } from "../store/user/userSlice";
import { swipePhotoAction } from "../store/user/userActions";
import { FEED_SIZE, FeedPhotoData } from "../store/storeStates";

function Feed() {
  const dispatch = useDispatch();
  const feed: FeedPhotoData[] | null = useSelector(selectFeed);
  const feedIdx: number = useSelector(selectFeedIdx);
  if (!feed || feedIdx >= FEED_SIZE) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Feed</h1>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <button style={{width:'100px', height: '100px', fontSize: '80px', border: 'none', background: 'none'}} onClick={() => dispatch(swipePhotoAction({ liked: false }))}>👈</button>
        <div>
          <img
            src={feed[feedIdx].photoUrl}
            alt={`url is ${feed[feedIdx].photoUrl}`}
            style={{ width: '300px', height: '300px' }}
          />
          <p><em>@{feed[feedIdx].username}</em></p>
        </div>
        <button style={{width:'100px', height: '100px', fontSize: '80px', border: 'none', background: 'none'}} onClick={() => dispatch(swipePhotoAction({ liked: true }))}>👉</button>
      </div>
      
    </div>
  )
}

export default Feed