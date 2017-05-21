var Tabela = function (tableId) {
    this.tableId = tableId;
    this.header = [];

    this.onAdd;
    this.onEdit;
    this.onRemove;

    this.selectedRow = {};

    var self = this;

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

            newModel[value.code] = undefined;
            input.on('input', function (e) {
                newModel[value.code] = $(this).val()
            });

            formGroup.append(label);
            formGroup.append(input);

            form.append(formGroup);
        });

        var submit = $("<button class='btn btn-primary'>Add it!</button>");
        submit.on('click', function () {
            var addResponse = self.onAdd(newModel)
            if(addResponse.success){
                dialogBackground.remove();
            }else {
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
            input.on('input', function (e) {
                newModel[value.code] = $(this).val()
            });

            formGroup.append(label);
            formGroup.append(input);

            form.append(formGroup);
        });

        var submit = $("<button class='btn btn-primary'>Add it!</button>");
        submit.on('click', function () {
            var editResponse = self.onEdit(newModel)
            if(editResponse.success){
                dialogBackground.remove();
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
        var table = $('#' + this.tableId).DataTable();


        $('#' + this.tableId + ' tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });


        if (this.onAdd) {
            $("#bankAccountsTable_filter").prepend($('<button/>',
                {
                    text: 'Add',
                    class: "form-control",
                    click: function () { openAddDialog(); }
                }
            ))
        }

        if (this.onEdit) {
            $("#bankAccountsTable_filter").prepend($('<button/>',
                {
                    text: 'Edit',
                    class: "form-control",
                    click: function () {   openEditDialog();  }
                }
            ))
        }

        if (this.onRemove) {
            $("#bankAccountsTable_filter").prepend($('<button/>',
                {
                    text: 'Remove',
                    class: "form-control",
                    click: function () {
                        var removeResponse = self.onRemove()
                        if(removeResponse.success){
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