function forEach(coll, process){
    output = []
    console.log(coll)
    for(x in coll){
        process(coll[x]);
    }
}