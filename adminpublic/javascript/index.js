
console.log("indexxxxxxxx")

$("#update-product").submit(function(event){
    event.preventDefault()
    console.log("first")
    var unindexed_array = $(this).serializeArray() //ethil submit cheytha ella datayum kanum, this ennathu update_user aanu
    // console.log(unindexed_array)
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })
    console.log(data)
    console.log("second")
    var request = {
        "url" : `http://localhost:3000/admin/api/users/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})


$("#update-category").submit(function(event){
    event.preventDefault()
    console.log("first")
    var unindexed_array = $(this).serializeArray() //ethil submit cheytha ella datayum kanum, this ennathu update_user aanu
    // console.log(unindexed_array)
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })
    console.log(data)
    console.log("second")
    var request = {
        "url" : `http://localhost:3000/admin/category/users/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})



$("#eidt-category").submit(function(event){
    event.preventDefault()
    console.log("first")
    var unindexed_array = $(this).serializeArray() 
    // console.log(unindexed_array)
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })
    console.log(data)
    console.log("second")
    var request = {
        "url" : `http://localhost:3000/admin/eidt-category/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})


$("#update-coupon").submit(function(event){ 
    event.preventDefault()
    console.log("first")
    var unindexed_array = $(this).serializeArray() //ethil submit cheytha ella datayum kanum, this ennathu update_user aanu
    // console.log(unindexed_array)
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })
    console.log(data.id)
    console.log(data)
    console.log("second")

    const text = data.id
    let id = text.trim();
    console.log(id+"....")
    var request = {
        
        "url" : `http://localhost:3000/admin/coupon/update/${id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})


$("#update-offer").submit(function(event){ 
    event.preventDefault()
    console.log("first")
    var unindexed_array = $(this).serializeArray() //ethil submit cheytha ella datayum kanum, this ennathu update_user aanu
    // console.log(unindexed_array)
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })
    console.log(data.id)
    console.log(data)
    console.log("second")

    const text = data.id
    let id = text.trim();
    console.log(id+"....")
    var request = {
        
        "url" : `http://localhost:3000/admin/offer/update/${id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})





$("#clickbtn").submit(function(event){
    event.preventDefault()
    console.log("haiii")
})