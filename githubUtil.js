function formatIssues(jsonIssues) {
    var htmlIssues = [];
    $.each(jsonIssues, function(key, val) {
        var issue = '<tr>' +
                '<td><a href="' + val.html_url + '">' + val.title + '</a></td>';
        if (val.assignee) {
            issue += '<td>' + val.assignee.login + '</td>';
        } else {
            issue += '<td>None</td>';
        }
        htmlIssues.push(
                issue +
                '<td> </td>' +
                '<td>' + val.state + '</td>' +
                '</tr>');
    });
    return htmlIssues;
};

function githubMilestones(githubRepo, divId) {
    // Query open milestone
    $.getJSON('https://api.github.com/repos/' + githubRepo + '/milestones', function(data) {

        $.each(data, function(key, val) {
            var tableTemplate = '<div class="panel panel-primary">\
                <div id="milestone_title_' + val.number + '" class="panel-heading">\
                </div>\
                <div class="panel-body">\
                    <div id="milestone_' + val.number + '"></div>\
                </div>\
                <table class="table table-striped">\
                    <thead>\
                        <tr>\
                            <th>Task name</th>\
                            <th>Assignee</th>\
                            <th>Priority</th>\
                            <th>State</th>\
                        </tr>\
                    </thead>\
                    <tbody id="milestone_issues_' + val.number + '">\
                    </tbody>\
                </table>\
            </div>'
            $(tableTemplate).prependTo(divId);

            var d = new Date(val.due_on);
            // Add title with current milestone
            $('<h3 class="panel-title">Milestone: <a href="https://github.com/' + githubRepo + '/issues?milestone=' + val.number + '">' + val.title + '</a></h3>')
                    .appendTo('#milestone_title_' + val.number);
            $(
                    '<p>' + val.open_issues + ' open issues - ' +
                    ' ' + val.closed_issues + ' closed issues - ' +
                    'due on: ' + d.toString() + '</p>').appendTo('#milestone_' + val.number);


            // Query the closed issues of the current milestone
            $.getJSON('https://api.github.com/repos/' + githubRepo + '/issues?state=closed&milestone=' + val.number, function(data) {
                var issues = formatIssues(data);
                $(issues.join('')).appendTo('#milestone_issues_' + val.number);
            });

            // Query the open issues of the current milestone
            $.getJSON('https://api.github.com/repos/' + githubRepo + '/issues?milestone=' + val.number, function(data) {
                var issues = formatIssues(data);
                $(issues.join('')).appendTo('#milestone_issues_' + val.number);
            });
        });

    });
}

function githubIssueLabel(githubRepo, title, label, divId) {
    var tableTemplate = '<div class="panel panel-primary">\
        <div id="issues_title_' + label + '" class="panel-heading">\
            <h3 class="panel-title"><a href="https://github.com/' + githubRepo + '/issues?labels=' + label +
            '">' + title + '</a></h3>\
        </div>\
        <table class="table table-striped">\
            <thead>\
                <tr>\
                    <th>Task name</th>\
                    <th>Assignee</th>\
                    <th>Priority</th>\
                    <th>State</th>\
                </tr>\
            </thead>\
            <tbody id="issues_list_' + label + '">\
            </tbody>\
        </table>\
    </div>'
    $(tableTemplate).appendTo(divId);

    // Query the ongoing projects
    $.getJSON('https://api.github.com/repos/' + githubRepo + '/issues?labels=' + label, function(data) {
        var issues = formatIssues(data);
        $(issues.join('')).appendTo('#issues_list_' + label);
    });
}
