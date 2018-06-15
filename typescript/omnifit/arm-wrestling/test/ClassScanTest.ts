module myContainer {

    @magical
    export class foo {
    }

    export class bar {
    }

    @magical
    export class bas {
    }
}


function magical(item: any) {
    item.isMagical = "indeed";
}

function findMagicalInScope(theScope: any) {
    for(let prop in theScope) {
        if (theScope[prop]["isMagical"]) {
            console.log(`Is ${prop} magical?  ${theScope[prop]["isMagical"]}!`);
        } else {
            console.log(`${prop} is not magical.  :-(`);
        }
    }
}

findMagicalInScope(myContainer);