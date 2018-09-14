const app = angular.module('chartApp', []);

app.controller('controller', function ($scope) {
    $scope.users = [];
    $scope.groups = [];

    $scope.groupsMessageCount = [];
    $scope.groupNames = [];
    $scope.groupEventCount = [];
    $scope.groupMembersCount = [];
    $scope.names = [];
    $scope.groupsCount = [];

    let firstChart, secondChart, thirdChart, fourthChart;
    let charts = [];

    $scope.init = () => {
        firebase.database().ref().child("users/").on("value", (data) => {
            // $scope.users.push(data.val());
            $scope.users = data.val();
            $scope.generateCharts();
        });

        firebase.database().ref().child("groups/").on("value", (data) => {
            // $scope.groups.push(data.val());
            $scope.groups = data.val();
            $scope.generateCharts();
        });
    };
    $scope.prepare = async () => {
        $scope.groupsMessageCount = [];
        $scope.groupNames = [];
        $scope.groupEventCount = [];
        $scope.groupMembersCount = [];
        $scope.names = [];
        $scope.groupsCount = [];

        console.log($scope.users);
        console.log($scope.groups);

        if ($scope.users !== null) {
            await Object.values($scope.users).forEach((user) => {
                $scope.names.push(user.name);
                if (user.groups !== undefined && user.groups !== null) {
                    $scope.groupsCount.push(Object.keys(user.groups).length)
                } else {
                    $scope.groupsCount.push(0)
                }
            });
        }

        if ($scope.groups !== null) {
            await Object.values($scope.groups).forEach((group) => {
                $scope.groupNames.push(group.name);
                if (group.members !== undefined && group.members !== null) {
                    $scope.groupMembersCount.push(Object.keys(group.members).length)
                } else {
                    $scope.groupMembersCount.push(0)
                }

                if (group.events !== undefined && group.events !== null) {
                    $scope.groupEventCount.push(Object.keys(group.events).length);
                } else {
                    $scope.groupEventCount.push(0);
                }

                if (group.chat !== undefined && group.chat !== null) {
                    $scope.groupsMessageCount.push(Object.keys(group.chat).length);
                } else {
                    $scope.groupsMessageCount.push(0);
                }
            })
        }
    };

    $scope.generateCharts = async () => {
        $scope.prepare().then(async () => {
            // let canvas = document.getElementById("firstChart");
            // let ctx = canvas.getContext('2d');
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            //
            // canvas = document.getElementById("secondChart");
            // ctx = canvas.getContext('2d');
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            //
            // canvas = document.getElementById("thirdChart");
            // ctx = canvas.getContext('2d');
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            //
            // canvas = document.getElementById("fourthChart");
            // ctx = canvas.getContext('2d');
            // ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (firstChart !== undefined) {
                firstChart.destroy();
            }

            if (secondChart !== undefined) {
                secondChart.destroy();
            }

            if (thirdChart !== undefined) {
                thirdChart.destroy();
            }

            if (fourthChart !== undefined) {
                fourthChart.destroy();
            }

            let userColors = [];
            let groupColors = [];

            $scope.names.forEach(() => {
                userColors.push(randomColor())
            });

            $scope.groupNames.forEach(() => {
                groupColors.push(randomColor())
            });

            firstChart = new Chart("firstChart", {
                type: 'bar',
                data: {
                    labels: $scope.names,
                    datasets: [{
                        label: $scope.names,
                        data: $scope.groupsCount,
                        backgroundColor: userColors
                    }]

                },
                options: {
                    title: {
                        display: true,
                        text: '# of groups'
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            secondChart = new Chart("secondChart", {
                type: 'pie',
                data: {
                    labels: $scope.groupNames,
                    datasets: [{
                        label: $scope.groupNames,
                        data: $scope.groupMembersCount,
                        backgroundColor: groupColors
                    }]

                }, options: {
                    title: {
                        display: true,
                        text: '# of members'
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            thirdChart = new Chart("thirdChart", {
                type: 'bar',
                data: {
                    labels: $scope.groupNames,
                    datasets: [{
                        label: $scope.groupNames,
                        data: $scope.groupsMessageCount,
                        backgroundColor: groupColors
                    }]

                }, options: {
                    title: {
                        display: true,
                        text: '# of messages'
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            fourthChart = new Chart("fourthChart", {
                type: 'bar',
                data: {
                    labels: $scope.groupNames,
                    datasets: [{
                        label: $scope.groupNames,
                        data: $scope.groupEventCount,
                        backgroundColor: groupColors
                    }]

                }, options: {
                    title: {
                        display: true,
                        text: '# of events'
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        });
    };
});

function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
}