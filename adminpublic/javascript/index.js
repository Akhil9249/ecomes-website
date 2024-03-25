
$("#update-product").submit(function(event){
    event.preventDefault()
    var unindexed_array = $(this).serializeArray() //ethil submit cheytha ella datayum kanum, this ennathu update_user aanu
    
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })
    
    var request = {
        "url" : `http://localhost:3000/admin/api/users/${data.id}`,
        "method" : "patch",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})


$("#update-category").submit(function(event){
    console.log("update-category");
    event.preventDefault()
    var unindexed_array = $(this).serializeArray() //ethil submit cheytha ella datayum kanum, this ennathu update_user aanu
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })

    var request = {
        "url" : `http://localhost:3000/admin/category/users/${data.id}`,
        "method" : "patch",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})



$("#eidt-category").submit(function(event){
    event.preventDefault()
    var unindexed_array = $(this).serializeArray() 
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })
    var request = {
        "url" : `http://localhost:3000/admin/eidt-category/${data.id}`,
        "method" : "patch",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})


$("#update-coupon").submit(function(event){ 
    event.preventDefault()
    var unindexed_array = $(this).serializeArray() //ethil submit cheytha ella datayum kanum, this ennathu update_user aanu
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })

    const text = data.id
    let id = text.trim();
    var request = {
        
        "url" : `http://localhost:3000/admin/coupon/update/${id}`,
        "method" : "patch",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})


$("#update-offer").submit(function(event){ 
    event.preventDefault()
    var unindexed_array = $(this).serializeArray() //ethil submit cheytha ella datayum kanum, this ennathu update_user aanu
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })


    const text = data.id
    let id = text.trim();
    var request = {
        
        "url" : `http://localhost:3000/admin/offer/update/${id}`,
        "method" : "patch",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})

$("#clickbtn").submit(function(event){
    event.preventDefault()
})