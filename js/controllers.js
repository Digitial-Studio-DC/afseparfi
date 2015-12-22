var afseparfiControllers = angular.module('afseparfiControllers', []);

afseparfiControllers.controller("VehicleIndexController", ['$scope', '$firebaseArray', '$window', '$filter',
  function($scope, $firebaseArray, $window, $filter) {
	//TODO REMOVE WHEN WE GO LIVE. Added this here for mobile clients to be able to clear data
	$window.localStorage.removeItem("eparatings");

	//TODO move to service
	$scope.ratings = JSON.parse($window.localStorage.getItem("eparatings")) ||  [] ;
	$scope.compare = {};
	$scope.vehicleModels1 = [];
	$scope.vehicleModels2 = [];
	$scope.vehicleModels3 = [];
	
	//TODO fix usage of angular-filter.js instead of doing this manually
	function filterMakes() {
		var unique = {};
		var distinct = [];
		for( var i in $scope.ratings ){
			if( typeof(unique[$scope.ratings[i].make]) == "undefined"){
				distinct.push($scope.ratings[i].make);
			}
			unique[$scope.ratings[i].make] = 0;
		}
		$scope.vehicleMakes = distinct;
	}
	
	
	if ($scope.ratings.length == 0) {
		var ref = new Firebase("https://dazzling-fire-2583.firebaseio.com/ratings");	 
		$scope.ratings = $firebaseArray(ref);
		$scope.ratings.$loaded().then(function(data) {
			//reverse list to show highest mpg on top
		    $scope.ratings.reverse();
		    //store locally to avoid database hit
		    $window.localStorage.setItem("eparatings", JSON.stringify($scope.ratings));
		    filterMakes();
		})
		.catch(function(error) {
			console.log("Error:", error);
		});
	} else {
		filterMakes();
	}

	$scope.getModelOptions = function(modelIndex) {
		
		switch (modelIndex) {
			case 1:
				$scope.vehicleModels1 = $.grep($scope.ratings, function(e){ return e.make == $scope.compare.vehicleMake1; });
				$scope.vehicleModels1 = $filter('orderBy')($scope.vehicleModels1, 'model');
				break;
			case 2:
				$scope.vehicleModels2 = $.grep($scope.ratings, function(e){ return e.make == $scope.compare.vehicleMake2; });
				$scope.vehicleModels2 = $filter('orderBy')($scope.vehicleModels2, 'model');
				break;
			case 3:
				$scope.vehicleModels3 = $.grep($scope.ratings, function(e){ return e.make == $scope.compare.vehicleMake3; });
				$scope.vehicleModels3 = $filter('orderBy')($scope.vehicleModels3, 'model');
				break;
		}
	}
	
	
}]);


afseparfiControllers.controller("VehicleListController", ['$scope', '$firebaseArray', '$window',
  function($scope, $firebaseArray, $window) {
	//TODO move to service
	$scope.ratings = JSON.parse($window.localStorage.getItem("eparatings")) ||  [] ;
	if ($scope.ratings.length == 0) {
		var ref = new Firebase("https://dazzling-fire-2583.firebaseio.com/ratings");	 
		$scope.ratings = $firebaseArray(ref);
		$scope.ratings.$loaded().then(function(data) {
			//reverse list to show highest mpg on top
		    $scope.ratings.reverse();
		    //store locally to avoid database hit
		    $window.localStorage.setItem("eparatings", JSON.stringify($scope.ratings));
//                                                        		    this.value("dataArray", $scope.ratings);
//                                                        		    console.error(this.dataArray);
		})
		.catch(function(error) {
			console.log("Error:", error);
		});
	}
}]);


afseparfiControllers.controller("VehicleDetailController", ['$scope', '$routeParams', '$window', '$firebaseObject',
  function($scope, $routeParams, $window, $firebaseObject) {
	var vehicleId = $routeParams.vehicleId;
	$scope.thisVehicle = {};
	
	//TODO move to service
	$scope.ratings = JSON.parse($window.localStorage.getItem("eparatings")) ||  [] ;
	if ($scope.ratings.length == 0) {
		var ref = new Firebase("https://dazzling-fire-2583.firebaseio.com/ratings/" + vehicleId);	
		$scope.thisVehicle = $firebaseObject(ref);
	} else {
//		var searchVehicles = $.grep($scope.ratings, function(e){ return e.$id == vehicleId; });
		$scope.thisVehicle = $scope.ratings.reduce(function(a, b){
			return (a.$id==vehicleId && a) || (b.$id == vehicleId && b)
		});
	}
}]);