angular.module("app", ["ui.router"])

.config(function($stateProvider, $urlRouterProvider)
{
    $stateProvider
        .state("books", {
            url: "/books",
            templateUrl: "templates/books.html",
            controller: "booksCtrl"
        })
        .state("addBooks", {
            url: "/books/add",
            templateUrl: "templates/books.add.html",
            controller: "booksCtrl"
        })
        .state("editBooks", {
            url: "/books/:id/edit",
            templateUrl: "templates/books.edit.html",
            controller: "booksCtrl"
        })
    $urlRouterProvider.otherwise("/books");
})

.constant("CONFIG", {
    API_URL: "http://127.0.0.1:5984/books"
})

.controller("booksCtrl", function($scope, $stateParams, $state, Books)
{
    Books.getAll().then(
        function(books)
        {
            $scope.books = books.data.rows;
        },
        function(error)
        {

        }
    );

    $scope.add = function()
    {
        $scope.book = {
            "name": null,
            "price":null
        }
    }

    $scope.save = function(book)
    {
        Books.add(book).then(
            function(res)
            {
                $state.go("books");
            },
            function(error)
            {

            }
        )
    }

    $scope._id = $stateParams.id;

    $scope.get = function(id)
    {
        Books.get(id).then(
            function(book)
            {
                $scope.book = book.data;
            },
            function(error)
            {

            }
        )
    }

    $scope.update = function(book)
    {
        Books.update(book).then(
            function(res)
            {
                $state.go("books");
            },
            function(error)
            {

            }
        )
    }

    $scope.remove = function(_id, _rev)
    {
        Books.remove(_id, _rev).then(
            function(res)
            {
                $state.reload();
            },
            function(error)
            {

            }
        )
    }
})

.factory("Books", function(CONFIG, $http)
{
    return {
        getAll: function()
        {
            return $http({
                url: CONFIG.API_URL + '/_design/books/_view/all',
                method: "GET"
            })
        },
        get: function(_id)
        {
            return $http({
                url: CONFIG.API_URL + '/' + _id,
                method: "GET"
            })
        },
        add: function(book)
        {
            return $http({
                url: CONFIG.API_URL,
                method: "POST",
                data: {
                    "name": book.name,
                    "price":book.price
                }
            })
        },
        update: function(book)
        {
            return $http({
                url: CONFIG.API_URL + '/' + book._id,
                method: "PUT",
                data: {
                    "_rev": book._rev,
                    "name": book.name,
                    "price":book.price
                }
            })
        },
        remove: function(_id, _rev)
        {
            return $http({
                url: CONFIG.API_URL + '/' + _id + '/?rev=' + _rev,
                method: "DELETE"
            })
        }
    }
})

curl -X PUT http://localhost:5984/_config/httpd/enable_cors -d '"true"'
curl -X PUT http://localhost:5984/_config/cors/origins -d '"*"'
