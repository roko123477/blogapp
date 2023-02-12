
import React,{useState} from 'react'
import FadeLoader from "react-spinners/FadeLoader";

const Loader = () => {
    let [loading, setLoading] = useState(true);
  
  return (
    <div style={{display:"block",width:"60%",marginLeft:"450px",marginRight:"auto",marginTop:"400px"}}>
        <div className="sweet-loading text-center">
      

      <FadeLoader
        color={'#888'}
        loading={loading}
        cssOverride=''
        size={60}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
    </div>
  )
}

export default Loader