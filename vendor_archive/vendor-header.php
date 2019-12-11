<!DOCTYPE html>
<html>
	<head>
		
		<?php 
		include('./partials/session.php');
		include('./partials/definitions.php');
		include('./partials/meta.php');
		//include('partials/tags.php');
		include('./partials/scripts.php'); 
		include('./partials/styles.php');
		?>        
		<title>Utterfare</title>
	</head>
	<body ng-app="utterfare">
		<nav class="navbar navbar-expand-md navbar-light bg-light">
			<a class="navbar-brand" href="http://localhost/utterfare">
				<img  class="profile-image__small" src="<?php echo BASE_URL; ?>assets/img/favicon.ico"/>
			</a>
		    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		    	      <span class="navbar-toggler-icon"></span>

		    </button>
			<form novalidate class="form-inline my-2 my-lg-0 search-form" ng-submit="search(search)" ng-controller="SearchController">
				<a class="location-link" onclick="showLocationPopover()"><i class='fas fa-map-marker-alt'></i>{{location}}</a>
				<input class="form-control mr-sm-2 search-form__input" type="search" placeholder="Search" aria-label="Search" ng-model="search.terms">
			</form>
					    
		</nav>
		<?php include('partials/loading.php');