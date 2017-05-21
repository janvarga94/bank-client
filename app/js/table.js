var Tabela = function (tableId) {
    this.tableId = tableId;
    this.header = [];

    this.onAdd;
    this.onEdit;
    this.onRemove;

    this.selectedRow = {};

    var self = this;

    $(document).on("rowSelected", function (ev) { self.selectedRow = ev.message });

    var openAddDialog = function () {
        var dialogBackground = $("<div onclick=\"$(this).remove()\" style='position: fixed; width:100%; height:100%; background-color:rgba(100,100,100,0.5); z-index:100;'></div>");
        var dialog = $("<div style='position:absolute; background-color:white; left:40%; top:100px;'></div>");
        var form = $("<div style='margin:10px;'></div>");

        form.click(function (ev) {
            ev.stopPropagation();
        });

        var newModel = {};

        $.each(self.header, function (index, value) {
            var formGroup = $("<div class='form-group'></div>");
            var label = $("<label>" + value.label + "</label>");
            var input = $("<input type='" + value.type + "' style='padding:10px;' class='form-control'/>");

            newModel[value.code] = null;
            setInterval(function () {
                newModel[value.code] = input.val();
            }, 200);


            formGroup.append(label);
            formGroup.append(input);

            if (value.zoomClick) {
                var zoomButton = $("<button class='btn btn-primary'>..</button>");
                zoomButton.on('click', function () {
                    if (value.zoomClick)
                        value.zoomClick();
                });

                $(document).on("zoomChoosen", function (event) {
                    input.val(event.message);
                });

                formGroup.append(zoomButton);
            }

            form.append(formGroup);
        });

        var submit = $("<button class='btn btn-primary'>Add it!</button>");
        submit.on('click', function () {
            var addResponse = self.onAdd(newModel)
            if (addResponse.success) {
                dialogBackground.remove();
                self.table.row.add(Object.values(newModel)).draw(false);
            } else {
                alert(addResponse.message);
            }
        });

        form.append(submit);


        dialog.append(form);
        dialogBackground.append(dialog);

        $("body").prepend(dialogBackground);
    }

    var openEditDialog = function (model) {
        var dialogBackground = $("<div onclick=\"$(this).remove()\" style='position: fixed; width:100%; height:100%; background-color:rgba(100,100,100,0.5); z-index:100;'></div>");
        var dialog = $("<div style='position:absolute; background-color:white; left:40%; top:100px;'></div>");
        var form = $("<div style='margin:10px;'></div>");

        form.click(function (ev) {
            ev.stopPropagation();
        });

        var newModel = {};

        $.each(self.header, function (index, value) {
            var formGroup = $("<div class='form-group'></div>");
            var label = $("<label>" + value.label + "</label>");
            var input = $("<input  value='" + self.selectedRow[value.code] + "' type='" + value.type + "' style='padding:10px;' class='form-control'/>");

            newModel[value.code] = self.selectedRow[value.code];
            setInterval(function () {
                newModel[value.code] = input.val();
            }, 200);

            formGroup.append(label);
            formGroup.append(input);

            if (value.zoomClick) {
                var zoomButton = $("<button class='btn btn-primary'>..</button>");
                zoomButton.on('click', function () {
                    if (value.zoomClick)
                        value.zoomClick();
                });

                $(document).on("zoomChoosen", function (event) {
                    input.val(event.message);
                });

                formGroup.append(zoomButton);
            }
            form.append(formGroup);
        });

        var submit = $("<button class='btn btn-primary'>Confirm!</button>");
        submit.on('click', function () {
            var editResponse = self.onEdit(newModel)
            if (editResponse.success) {
                dialogBackground.remove();
                self.table.row('.selected').remove().draw(false);
                self.table.row.add(Object.values(newModel)).draw(false);
            }
            else {
                alert(editResponse.message);
            }
        });

        form.append(submit);


        dialog.append(form);
        dialogBackground.append(dialog);

        $("body").prepend(dialogBackground);
    }



    this.generate = function () {
        // Setup - add a text input to each footer cell
        $('#' + this.tableId + ' tfoot th').each(function () {
            var title = $(this).text();
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
        });

        // DataTable
        var table = self.table = $('#' + this.tableId).DataTable();


        $('#' + this.tableId + ' tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        table.columns().every(function () {
            var that = this;

            $('input', this.footer()).on('keyup change', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });


        if (this.onAdd) {
            $('#' + this.tableId + "_filter").prepend($('<button/>',
                {
                    text: 'Add',
                    class: "form-control",
                    click: function () { openAddDialog(); }
                }
            ))
        }

        if (this.onEdit) {
            $('#' + this.tableId + "_filter").prepend($('<button/>',
                {
                    text: 'Edit',
                    class: "form-control",
                    click: function () { openEditDialog(); }
                }
            ))
        }

        if (this.onRemove) {
            $('#' + this.tableId + "_filter").prepend($('<button/>',
                {
                    text: 'Remove',
                    class: "form-control",
                    click: function () {
                        var removeResponse = self.onRemove()
                        if (removeResponse.success) {
                            table.row('.selected').remove().draw(false);
                        }
                        else {
                            alert(removeResponse.message);
                        }

                    }
                }
            ))
        }
    }
}