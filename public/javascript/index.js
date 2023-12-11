


$('.db-list').on('focus', function () {
    console.log("innnnn")
    var ddl = $(this);
    ddl.data('previous', ddl.val());
}).on('change', function () {
    var ddl = $(this);
    var previous = ddl.data('previous');
    ddl.data('previous', ddl.val());

    if (previous) {
        $('#fields-list').find('select option[value='+previous+']').removeAttr('disabled');
    }

    $('#fields-list').find('select option[value='+$(this).val()+']:not(:selected)').prop('disabled', true);
});


// $("#update-adress").submit(function(event){ 
//     event.preventDefault()
//     console.log("first")
//     var unindexed_array = $(this).serializeArray() //ethil submit cheytha ella datayum kanum, this ennathu update_user aanu
//     // console.log(unindexed_array)
//     var data = {}

//     $.map(unindexed_array,function(n,i){
//         data[n['name']] = n['value']
//     })
//     console.log(data.id)
//     console.log(data)
//     console.log("second")

//     const text = data.id
//     let id = text.trim();
//     console.log(id+"....")
//     var request = {
        
//         "url" : `http://localhost:3000/adress/update/${id}`,
//         "method" : "PUT",
//         "data" : data
//     }

//     $.ajax(request).done(function(response){
//         alert("Data Updated Successfully!")
//     })
// })

$("#update-adress").submit(function(event){
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
        "url" : `http://localhost:3000/adress/update/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})


