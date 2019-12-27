var page = 1;

window.getVendorStatus = function(){
	console.log(session);
	if(window.session.length !== 0){
		session = $.parseJSON(session);
		console.log(session);
		if(session.UF_VENDOR_USER_SIGNED_IN === true){
			return session.UF_VENDOR_USER_ID;
		}
	}
	
	return false;
}

window.vendorSignIn = function(){
	var data = $('.vendor-login-form').serialize();
	data += '&action=vendor_sign_in';
	
	console.log(data);
	console.log(window.vendor_class_url);
	
	var success = false;
	
	$.post(window.vendor_class_url, data, function(response){
		console.log(response);
		console.log(response.success);
		success = response.success;
	}, 'json')
	.fail(function(error){
		console.log('error');
		console.log(error);
	})
	.done(function(){
		console.log(success);
		if(success === true){
			window.location.href= "/vendor";
		}else{
			notify();
		}
	});
}

window.confirmDelete = function(){
	$('.delete-item-button').popover({
		container: 'body',
		content: 'Are you sure you want to delete this item? This action cannot be undone.<hr><a class="btn btn-outline-danger" href="">Delete Item</a> <a class="btn btn-outline-secondary" onclick="closePopover();">Cancel</a>',
		html: true,
		title: 'Confirm Delete Item'
	});
}

function closePopover(){
	console.log('close');
	$('.delete-item-button').popover('trigger');
}

function notify(){
	console.log("Notify the user of something");
}

window.getMenuItems = function(page){
	
	this.page = page;
	
	if(page === null || page === undefined){
		page = 1;
	}

	var limit = 10;
	var offset = (page - 1) * limit;
	
	var data = {
		action: 'get_menu_items', 
		offset: offset,
		limit: limit,
	}
	
	var display = document.createElement('tbody');
	var pagination = document.createElement('ul');
	pagination.className = 'pagination';
	
	var totalItems = 0;
	
	
	
	$.post(window.vendor_class_url, data, function(results){
		if(results.length > 0){
						
			totalItems = results[0].total_items;
			var totalPages = totalItems/limit;
			
			for(i = 1; i <= totalPages; i++){
				var pageWrapper = document.createElement('li');
				var pageElement = document.createElement('a');
				
				// Set the active page element
				if(page === i){
					pageWrapper.className = 'page-item active';
				}else{
					pageWrapper.className = 'page-item';	
				}
				
				pageElement.textContent = i;
				pageElement.className = 'page-link';
				pageElement.setAttribute('href', '');
				pageElement.setAttribute('onclick', 'return getMenuItems(' + i + ');');
				
				pageWrapper.appendChild(pageElement);
				pagination.appendChild(pageWrapper);
				
			}			
			
			$.each(results, function(key, result){
				
				var row = document.createElement("tr");
				
				// Table columns
				var imgColumn = document.createElement('td');
				var nameColumn = document.createElement('td');
				var descColumn = document.createElement('td');
				var editDeleteColumn = document.createElement('td');

				// HTML Elements
				var itemImage = document.createElement('img');
				var itemName = document.createElement('span');
				var itemDescription = document.createElement('span');
				var editButton = document.createElement('a');
				var deleteButton = document.createElement('button');
				
				itemName.textContent = result.item_name;
				itemDescription.textContent = result.item_description;
				
				deleteButton.className = "btn btn-outline-danger delete-item-popover";
				editButton.className = "btn btn-outline-info";
				
				editButton.setAttribute("href", "#!/items/edit?item_id=" + result.item_id);
				deleteButton.setAttribute("onclick", "confirmDeleteItem(" + result.item_id + ")");
				deleteButton.setAttribute('type', 'button');
				deleteButton.setAttribute('data-title', "Confirm Delete Item");
				deleteButton.setAttribute('data-toggle', 'popover');
				deleteButton.setAttribute('data-content', 'popover content');
				deleteButton.setAttribute('data-placement', 'top');
				
				editButton.textContent = "Edit";
				deleteButton.textContent = "Delete";
								
				itemImage.setAttribute('src', result.primary_image);
				itemImage.setAttribute('alt', result.item_name);
				itemImage.setAttribute('class', 'items-table--item-image');
				
				imgColumn.appendChild(itemImage);				
				nameColumn.appendChild(itemName);
				descColumn.appendChild(itemDescription);
				editDeleteColumn.appendChild(editButton);
				editDeleteColumn.appendChild(deleteButton);
				
				row.setAttribute('data-item-id', result.item_id);
				row.appendChild(imgColumn);
				row.appendChild(nameColumn);
				row.appendChild(descColumn);
				row.appendChild(editDeleteColumn);
				
				display.appendChild(row);
				
			});
		}
	}, 'json')
	.fail(function(error){
		console.log("Error");
		console.log(error);
	})
	.done(function(){
		console.log(display);
		if(display !== ""){
			$('.items-table tbody').replaceWith(display);
			$('.pagination').replaceWith(pagination);
			$('.results-count--range').text(offset + 1 + " to " + (offset + limit));
			$('.results-count--total').text(totalItems);
		}
	});
	
	return false;
}



window.confirmDeleteItem = function(item_id){
	var confirmDelete = window.confirm("Are you sure you want to delete this item? This action CANNOT be undone.");
	if(confirmDelete){
		var data = {
			action: 'delete_item', 
			item_id: item_id,
		};
		$.post(window.vendor_class_url, data, function(response){
			console.log(response);
		})
		.fail(function(error){
			console.log("error");
			console.log(error);
		})
		.done(function(){
			getMenuItems(page);
		});
	}
}

window.signUserOut = function(){
	var data = {
		action: 'sign_user_out',
	};
	
	$.post(window.vendor_class_url, data, function(results){
		console.log(results);
	})
	.fail(function(error){
		console.log('fail');
		console.log(error);
	})
	.done(function(){
		window.location.href="#!/vendor";
	});
	
	return false;
}

window.getItem = function(itemId){
	var data = {
		action: 'get_item',
		item_id: itemId,
	}
	
	var results = null;
	$.post(window.vendor_class_url, data, function(response){
		results = response;
		
	}, 'json')
	.fail(function(error){
		console.log("error");
		console.log(error);
	})
	.done(function(){
		$('form[name="edit-item-form"]').attr('data-item-id', itemId);
		$('input[name="item-name"]').val(results.item_name);
		$('textarea[name="item-description"]').val(results.item_description);
		$('.edit-item--item-image').attr('src', results.primary_image);
	});
}

window.setPreview = function(input){
	
	var reader = new FileReader();
	reader.onload = function(e){
		$('.edit-item--item-image').attr('src', e.target.result);
	}
	reader.readAsDataURL(input.files[0]);
}

window.addEditItem = function(form){
	
	let itemId = $(form).attr('data-item-id');
	
	
	
	var formData = new FormData(form);
	
	if(itemId !== undefined && itemId !== ""){
		formData.append('action', 'update_item');
		formData.append('item-id', $(form).attr('data-item-id'));
	}else{
		formData.append('action', 'add_new_item');
	}
	
	
	
	var results = null;

	$.ajax({
		url: window.vendor_class_url, 
		data: formData, 
		type: 'POST', 
		processData: false,
		cache: false, 
		contentType: false,
		dataType: 'json',
		success: function(response){
			
			if(response.item_id !== undefined){
				results = response.item_id;
			}else if(response.success !== undefined){
				results = response.success;
			}
		},
		error: function(error){
			console.log("Error");
			console.log(error);
		},
		complete: function(){
			console.log(results);
			if(results >= 1){
				if($.isNumeric(results)){ // If it is a new item we are setting the item ID data attribute
					form.setAttribute('data-item-id', results);
					var url = window.location.href + "?item_id=" + results;
					window.history.pushState({path: url}, '', url);
				}
				$('.toast').toast({
					delay: 5000,
				});
				$('.toast').toast('show');
			}else{
				console.log('nothing');
			}
		}
	});
}