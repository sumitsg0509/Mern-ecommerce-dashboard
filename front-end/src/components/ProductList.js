import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductList(){

  // products store करण्यासाठी state
  const [products,setProducts] = useState([]);

  // page load झाल्यावर products fetch
  useEffect(()=>{
    getProducts();
  },[]);

  // backend मधून products fetch
  const getProducts = async () => {

    let result = await fetch("http://localhost:5000/products");
    result = await result.json();

    setProducts(result);

  }

  // product delete function
  const deleteProduct = async (id) => {

    await fetch(`http://localhost:5000/product/${id}`,{
      method:"Delete"
    });

    // delete नंतर products refresh
    getProducts();

  }

  // 🔎 SEARCH FUNCTION
  const searchHandle = async (key) => {

    // search box रिकामा असेल तर पुन्हा full list load
    if(key){

      let result = await fetch(`http://localhost:5000/search/${key}`);
      result = await result.json();

      setProducts(result);

    }else{

      getProducts();

    }

  }

  return(

    <div className="product-list">

      <h1>Product List</h1>

      {/* 🔎 SEARCH BOX */}
      <input
      type="text"
      placeholder="Search Product"
      className="search-product-box"
      onChange={(e)=>searchHandle(e.target.value)}
      />

      <table>

        <thead>

          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Price</th>
            <th>Brand</th>
            <th>Delete</th>
            <th>Update</th>
          </tr>

        </thead>

        <tbody>

          {
            products.map((item,index)=>

              <tr key={item._id}>

                <td>{index+1}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.brand}</td>

                <td>
                  <button onClick={()=>deleteProduct(item._id)}>
                    Delete
                  </button>
                </td>

                <td>
                  <Link to={"/update/"+item._id}>
                    Update
                  </Link>
                </td>

              </tr>

            )
          }

        </tbody>

      </table>

    </div>

  )

}

export default ProductList;