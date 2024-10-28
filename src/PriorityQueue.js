// min heap
export class PriorityQueue{
    constructor(){
        this.values = [];
    }

    enqueue(node, priority){
        let flag = false;
        for(let i = 0; i < this.values.length; i++){
            if(this.values[i].priority > priority){
                this.values.splice(i, 0, {node, priority})
                flag = true;
                return;
            }
        }
        if(!flag){
            this.values.push({node, priority})
        }
    }

    dequeue(){
        return this.values.shift()
    }

    size(){
        return this.values.length;
    }


}