angular.module('myExample', [])
	.controller('ClientController', function($scope, $http) {

	  	$scope.selectClient = function(client){
			$scope.master = angular.copy(client);
			$scope.currClient = client;
			//console.log(client);
			$scope.setActiveTab(0);

			// Handle client details form
			$scope.clientFormAnswer = null

			// Handle transfers
			$scope.getClientTransfers($scope.currClient);
			$scope.newTransferForm.$setPristine();

			// Empty the transfer fields
			$scope.newTransfer = {};
			$scope.newTransfer.TransferDate = (new Date()).toJSON().slice(0,10);

			$("div[class^='col-xs-6']:last")
				.addClass("col-xs-12")
				.removeClass("col-xs-6");
			$("div[class^='col-xs-6']").remove();
		};

		$scope.resetClient = function(){
			angular.copy($scope.master, $scope.currClient);
		};

		$scope.updateClient = function(client){
			$http({
			  method: 'PUT',
			  url: "/clients/",
			  params: client
			}).success(function (result) {
				$scope.showActionResultAlert();
				setTimeout(function(){$("#myModal").modal('hide');}, 500);
				
			}).error(function(data, status, headers, config) {
				$scope.showActionResultAlert(data);
			});
		}

		$scope.deleteClient = function(client){
			$http({
			  method: 'PUT',
			  url: "/clients/delete/" + client.CardID
			}).success(function (result) {
				if (result.success){
  					$scope.clients.splice($scope.clients.indexOf(client), 1); 
					angular.copy($scope.master, $scope.currClient);
					$scope.showActionResultAlert();
					setTimeout(function(){$("#myModal").modal('hide');}, 500);
				}
				else {
					$scope.showActionResultAlert(result.error);
				}

			}).error(function(data, status, headers, config) {
				$scope.showActionResultAlert(data.error);
			});	
		}

		$scope.getClientTransfers = function(client){
			var theURL = '/transfers?clientID=' + client.CardID;
			$http({
			  method: 'GET',
			  url: theURL
			}).success(function (result) {
			  $scope.transfers = result;
			  if ($scope.transfers.length == 0){
			  	$scope.$$childHead.$$childHead.options.aaData = $scope.transfers = null;
			  }
			  else {
				  var transfersForDataTable = [];
				  for (var i = 0; i < $scope.transfers.length; i++) {
				  	transfersForDataTable.push([$scope.transfers[i].TransferID,
				  		$scope.transfers[i].TransferNumber, 
				  		$scope.transfers[i].TransferDate,
				  		$scope.transfers[i].MoneyAmount, 
				  		$scope.transfers[i].TCurrency, 
				  		$scope.transfers[i].Comm]) 
				  };

				  $scope.$$childHead.$$childHead.options.aaData = transfersForDataTable;
			  }
			}).error(function(data, status, headers, config) {
			});	
		}

		$scope.addTransferToClient = function(transfer){
			var theURL = "/transfers/add/" + $scope.currClient.CardID;
			$http({
			  method: 'POST',
			  url: theURL,
			  params : transfer
			}).success(function (result) {
				$scope.showActionResultAlert();
				$scope.getClientTransfers($scope.currClient);
			}).error(function(data, status, headers, config) {
				$scope.showActionResultAlert(data);
			});
		}

		$scope.updateTransferOfClient = function(transfer, action){
			var theURL = "/transfers/" + action + "/" + transfer.transferID;
			$http({
			  method: 'PUT',
			  url: theURL,
			  params : transfer
			}).success(function (result) {
				$scope.transferToUpdate = null;
				$scope.showActionResultAlert();
				$scope.getClientTransfers($scope.currClient);
				
				// return to previous tab
				setTimeout(function(){
					$scope.setActiveTab(2);
				}, 500);

			}).error(function(data, status, headers, config) {
				$scope.showActionResultAlert(data);
			});	
		}

		$scope.filter = function(value, searchOption){
			$scope.clients = null;
			if (searchOption == "phone"){
				$scope.filterByPhone(value);
			}
			if (searchOption == "id"){
				$scope.filterByID(value);
			}
			if (searchOption == "country"){
				$scope.filterByCountry(value);
			}
		}

		$scope.filterByPhone = function(phone){
			var theURL = '/clients?phone=' + phone;
			$http({
			  method: 'GET',
			  url: theURL
			}).success(function (result) {
			  $scope.clients = result;
			}).error(function(data, status, headers, config) {
			});	
		}

		$scope.filterByID = function(id){
			$("#resultTable").removeClass("hidden");
			var theURL = '/clients?id=' + id;
			$http({
			  method: 'GET',
			  url: theURL
			}).success(function (result) {
			  $scope.clients = result;
			}).error(function(data, status, headers, config) {
			});	
		}

		$scope.filterByCountry = function(country){
			$("#resultTable").removeClass("hidden");
			var theURL = '/clients?country=' + country.toLowerCase();
			$http({
			  method: 'GET',
			  url: theURL
			}).success(function (result) {
			  $scope.clients = result;
			}).error(function(data, status, headers, config) {
				console.log("filterByCountry Error");
			});	
		}

		$scope.orderBy = function(field){
			if (field != $scope.orderByField){
				$scope.orderByField = field;
			}
			else{
				//$scope.descending = !$scope.descending;
				$scope.orderByField = "-" + field;		
			}
		}

		$scope.showUpdateScreen = function(transferID) {            
            // Get transfer by id
            var theURL = '/transfers?transferID=' + transferID;
			$http({
			  method: 'GET',
			  url: theURL
			}).success(function (result) {
				$scope.clientFormAnswer = null;
				$scope.transferToUpdate = result[0];
				$scope.setActiveTab(3);

				$scope.transferToUpdate.TransferDate = 
					$scope.transferToUpdate.TransferDate.split("/").reverse().concat().toString().replace(/,/gi,"-");
			}).error(function(data, status, headers, config) {
			});	
        }

        $scope.setActiveTab = function(tabIndex){
			$("#modalMainTabs li").removeClass("active");
			$("#modalMainTabs li:nth(" + tabIndex + ")").addClass("active");
			$("#modal-main-tabs>div[class^='tab-pane']").removeClass("active");
			$("#modal-main-tabs>div[class^='tab-pane']:nth(" + tabIndex + ")").addClass("active");
			if (tabIndex != 3){
				$scope.transferToUpdate = null;		
			}
        }

        $scope.showActionResultAlert = function(data){
        	if (!data){
				$scope.clientFormAnswer = "הפעולה בוצעה בהצלחה";
				$scope.clientFormAnswerSuccess = true;
        	}
        	else {
				$scope.clientFormAnswer = data;
				$scope.clientFormAnswerSuccess = false;
        	}
        }

        // Data Members
		$scope.clients = null;
		$scope.newTransfer = {};
		$scope.searchOption = "phone";
		$scope.orderByField = 'CardID';
		$scope.descending = false;
		$scope.transferToUpdate = null;
	})


	.controller('CountriesController', function($scope, $http) {
		$scope.countries = [];
		$http({
			  method: 'GET',
			  url: '/countries'
			})
			.success(function (result) {
			  $scope.countries = result;
			})
			.error(function(data, status, headers, config) {
			});
  	})

	// Connect datatables for the transfers table (in the client profile)
	.directive('clientTrasnfers', function () {
	    return {
	        restrict: 'E, A, C',
	        link: function (scope, element, attrs, controller) {
	            var dataTable = element.dataTable(scope.options);

	            scope.$watch('options.aaData', handleModelUpdates, true);

	            function handleModelUpdates(newData) {
	                var data = newData || null;
	                dataTable.fnClearTable();
	                if (data) {
	                    dataTable.fnAddData(data);
	                }
	            }
	        },
	        scope: {
	            options: "="
	        }
	    };
	});

function Ctrl($scope) {
    $scope.options = {
    	"fnCreatedRow": function( nRow, aData, iDataIndex ) {
    		$('td', nRow).bind('click', function() {
    			$scope.showUpdateScreen(aData[0]);
    		});
		},
		searching: false,
    	lengthChange: false,
    	info: false,
        aaData: null,
        aoColumns: [{
        	"visible" : false},
        	{
            "sTitle": "מס' העברה", "sType" : "number", "mRender" : function (data, type, row){
            	if (data){
            		return Number.parseInt(data);
            	}
            }
        }, {
            "sTitle": "תאריך", "sType": "date-eu", "dateFormat": "dd/mm/yyyy", "mRender" : function (data, type, row) {
                             if (data) {
                                 var date = new Date(data);
                                 return ((date.getDate() < 10 ? "0" : "") + date.getDate() + '/' + 
                                 			((date.getMonth() + 1) < 10 ? "0" : "") + 
                                 			(date.getMonth() + 1) + '/' +  date.getFullYear());
                             }
                             else
                                 return data
                         }
        }, {
            "sTitle": "כמות", "sType" : "number", "mRender" : function (data, type, row){
            	if (data){
            		return Number.parseInt(data);
            	}
            }
        }, {
            "sTitle": "מטבע", "sType" : "string"
        }, {
            "sTitle": "עמלה", "sType" : "number", "mRender" : function (data, type, row){
            	if (data){
            		return Number.parseInt(data);
            	}
            }
        }],
        bJQueryUI: true,
        bDestroy: true,
        "language": {
            "lengthMenu": "מציג _MENU_ רשומות בכל דף",
            "zeroRecords": "לא נמצאו רשומות",
            "info": "מציג דף _PAGE_ מתוך _PAGES_",
            "infoEmpty": "אין רשומות",
            "infoFiltered": "(סוננו מתוך _MAX_ הרשומות)",
            "paginate": {
		        "first":      "ראשון",
		        "last":       "אחרון",
		        "next":       "הבא",
		        "previous":   "קודם"
		    },
    		"search":         "חפש:"
        }
    };
}

