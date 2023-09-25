// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

library arrTransformations {
    function Sort(uint[] memory arry)pure public returns (uint[] memory)
    {
        uint n = arry.length;
        for (uint i = 0; i < n - 1; i++) {
            for (uint j = 0; j < n - i - 1; j++) {
                if (arry[j] > arry[j + 1]) {
                    (arry[j], arry[j + 1]) = (arry[j + 1], arry[j]);
                }
            }
        }
        return arry;
    }

      function delDuplicatearr(uint[] memory tempVar, uint[] storage data, uint[] storage RemovedArray) public returns (uint[] memory) {
       
        tempVar = Sort(data);
        uint n = tempVar.length;

        RemovedArray.push(tempVar[0]);
        for (uint i = 1; i < n; i++) {
            bool isDuplicate = false;
            for (uint j = 0; j < RemovedArray.length; j++) {
                if (tempVar[i] == RemovedArray[j]) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                RemovedArray.push(tempVar[i]);
            }
        }
        return RemovedArray;
    }
}

contract Arraysort {
    uint[] public data;
    uint[] sortedData;
    uint[] RemovedArray;
    uint[] tempVar;

    constructor(uint[] memory _initialData) {
        data = _initialData;
    }

    function getSortedArray() public returns (uint[] memory) {
        sortedData = arrTransformations.Sort(data);
        return sortedData;
    }

    function getArrayNoDupicates() public returns (uint[] memory) {
        sortedData = arrTransformations.delDuplicatearr(tempVar, data, RemovedArray);
        return sortedData;
    }


}
