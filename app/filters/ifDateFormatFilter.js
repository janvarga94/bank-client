app.filter('ifDateFormatFilter', function () {
  return function (input) {
    if (input instanceof Date && !isNaN(input.getTime()))
      return input.toISOString().slice(0, 10);
    return input;
  };
})