import React from 'react'
import { FaSearch } from 'react-icons/fa'
import styles from './searchBar.module.scss'

function SearchBar() {
  return (
    <div className={styles.container}>
        <div className={styles.search_icon}>
            <FaSearch />
        </div>
        <div className={styles.input}>
            <input type="text" placeholder="Search..." />
        </div>
    </div>
  )
}

export default SearchBar