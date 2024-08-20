import React,{ useRef }  from 'react'
import { useNavigate} from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import styles from './searchBar.module.scss'

function SearchBar() {

  const navigate = useNavigate();
  const postcode = useRef();
  const handleSearch = ( event) => {
    event.preventDefault();
    if (postcode.current) {
      const query = postcode.current.value.trim();
      if (query) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  }

  return (
    <div className={styles.container}>
        <div className={styles.search_icon}>
            <FaSearch />
        </div>
        <div className={styles.input} >
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="Enter postcode" ref={postcode}/>
          </form>
        </div>
    </div>
  )
}

export default SearchBar