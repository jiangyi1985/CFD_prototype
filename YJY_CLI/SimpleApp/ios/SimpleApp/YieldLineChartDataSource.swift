//
//  YieldLineChartDataSource.swift
//  TH_CFD
//
//  Created by william on 2017/4/13.
//  Copyright © 2017年 Facebook. All rights reserved.
//

protocol YieldLineChartDataProvider: BaseDataProvider
{
    func findHighlightPoint() -> CGPoint
    func showPreCloseLine() -> Bool
    func pointData() -> [CGPoint]
    func yPosOfMiddleLine() ->CGFloat
    func xVerticalLines() -> [CGFloat]
    func timesOnBottom() -> [Date]
    func firstTime() -> Date?
    func lastTime() -> Date?
    func isPrivate() -> Bool
}

class YieldLineData: BaseData {
    var price: Double = 0
    
    override init(dict:NSDictionary) {
        super.init(dict: dict)
        let timeString = dict["date"] as? String
        self.time = timeString?.toDate()
        price = (dict["pl"] as? Double)!
    }
}

class YieldLineChartDataSource: BaseDataSource, YieldLineChartDataProvider {
    var _lineData = [YieldLineData]()
    var stockData:StockData?
    
    var _pointData:[CGPoint] = []
    var verticalLinesX:[CGFloat] = []
    var verticalTimes:[Date] = []
    var middleLineY:CGFloat = 0
    var topLineY:CGFloat = 0
    var bottomLineY:CGFloat = 0
    
    var drawPreCloseLine = false
    
    override func parseJson() {
        // demo:{\"lastOpen\":\"2016-03-24T13:31:00Z\",\"preClose\":100.81,\"longPct\":0.415537619225466,\"id\":14993,\"symbol\":\"CVS UN\",\"name\":\"CVS\",\"open\":0,\"last\":101.48,\"isOpen\":false,\"priceData\":[{\"p\":100.56,\"time\":\"2016-03-24T13:30:00Z\"},{\"p\":100.84,\"time\":\"2016-03-24T13:31:00Z\"}]}
        let nsData: Data = _jsonString.data(using: String.Encoding.utf8)!
        _lineData = []
        do {
            let json: Any? = try JSONSerialization.jsonObject(with: nsData, options: JSONSerialization.ReadingOptions.mutableLeaves)
            if let jsonDict = json as? NSDictionary {
                if _jsonString.range(of: "priceData") != nil {
                    let jsonArray = jsonDict["priceData"] as! NSArray
                    for chartDict in jsonArray {
                        let lineData:YieldLineData = YieldLineData.init(dict: chartDict as! NSDictionary)
                        _lineData.append(lineData)
                    }
                }
            }
        }
        catch {
            print("error serializing JSON: \(error)")
        }
    }
    
    override func setChartType(_ newValue:String) {
        if ["userHomePage", "allYield"].contains(newValue) {
            super.setChartType(newValue)
            //            drawPreCloseLine = newValue == "today"
        }
    }
    
    static func isValidData(_ json:String) -> Bool {
        return json.contains("pl")
    }
    
    override func isEmpty() -> Bool {
        return _lineData.isEmpty
    }
    
    override func calculateData(_ rect:CGRect) {
        if _chartType == "undefined" {
            return
        }
        if (_rect == CGRect.zero || _lineData.isEmpty) {
            return
        }
        let width = chartWidth()
        let height = chartHeight()
        
        if _lineData.count == 1 {
            // only 1 point data, duplicate it.(one line need two points)
            _lineData.append(_lineData[0])
        }
        
        var maxValue = _lineData.reduce(0) { (max, data) -> Double in
            (max < data.price) ? data.price : max
        }
        
        var minValue = _lineData.reduce(100000000.0) { (min, data) -> Double in
            (min > data.price) ? data.price : min
        }
        
        let preClose = self.stockData?.preClose
        if let preClose = preClose {
            if (preClose > 0 && drawPreCloseLine) {
                maxValue = maxValue < preClose ? preClose : maxValue
                minValue = minValue > preClose ? preClose : minValue
            }
        }
        
        //calculate the x point
        let lastIndex = _lineData.count - 1
        let columnXPoint = { (column:Int) -> CGFloat in
            //Calculate gap between points
            let spacer = (width - self._margin*2) /
                CGFloat((lastIndex))
            var x:CGFloat = CGFloat(column) * spacer
            x += self._margin
            return x
        }
        
        
        // calculate the y point
        let topBorder:CGFloat = height * 0.12
        let bottomBorder:CGFloat = height * 0.15
        let graphHeight = height - topBorder - bottomBorder
        
        let columnYPoint = { (graphPoint:Double) -> CGFloat in
            var y:CGFloat = graphHeight/2
            if (maxValue > minValue) {
                y = CGFloat(graphPoint-minValue) / CGFloat(maxValue - minValue) * graphHeight
                y = graphHeight + topBorder - y // Flip the graph
            }
            else {
                // no data
                y = self._topMargin + (height-self._bottomMargin-self._topMargin)/2
            }
            return y
        }
        middleLineY = height/2
        if let preClose = preClose {
            if (preClose > 0 && maxValue > minValue) {
                middleLineY = (height-topBorder-bottomBorder) * CGFloat(maxValue - preClose) / CGFloat(maxValue - minValue)+topBorder
            }
        }
        
        if !drawPreCloseLine {
            middleLineY = 0		// do not draw this line
        }
        
        _pointData = []
        
        for i in 0..<_lineData.count {
            let x = columnXPoint(i)
            let y = columnYPoint(_lineData[i].price)
            let point:CGPoint = CGPoint(x:x, y:y)
            _pointData.append(point)
        }
        
        _maxValue = maxValue
        _minValue = minValue
        _preCloseValue = preClose
        
        self.calculateVerticalLines()
    }
    
    func calculateVerticalLines() -> Void {
        if (_rect == CGRect.zero || _lineData.isEmpty) {
            return
        }
        verticalLinesX = []
        verticalTimes = []
        
        let gaps = ["userHomePage":3600.0*24, "allYield":3600.0*24*7]
        let gap = gaps[_chartType]!		// gap between two lines
        
        if let time0 = _lineData.first?.time {
            var startTime = stockData?.lastOpen ?? Date()
            
            if _chartType == "userHomePage" {
                // 1 day, 1 line
                let interval:TimeInterval = time0.timeIntervalSince(startTime)
                let days = floor(interval / gap)
                startTime = Date(timeInterval: days*gap, since: startTime)
            }
            else if _chartType == "allYield" {
                // 1 week, 1 line
                startTime = startTime.sameTimeOnLastSunday()
                let interval:TimeInterval = time0.timeIntervalSince(startTime)
                let weeks = floor(interval / gap)
                startTime = Date(timeInterval: weeks*gap, since: startTime)
            }
            else {
                startTime = (_lineData.first?.time)!
            }
            
            for i in 0 ..< _lineData.count {
                if let time = _lineData[i].time {
                    let interval:TimeInterval = time.timeIntervalSince(startTime)
                    if interval > gap*0.99 {
                        verticalLinesX.append(_pointData[i].x+0.5)
                        startTime = time
                        verticalTimes.append(self._lineData[i].time! as Date)
                    }
                }
            }
        }
    }
    
    // MARK: delegate
    func findHighlightPoint() -> CGPoint {
        let point = _pointData.last!
        return point
    }
    
    func showPreCloseLine() -> Bool {
        return drawPreCloseLine
    }
    
    func pointData() -> [CGPoint] {
        return _pointData
    }
    
    func yPosOfMiddleLine() ->CGFloat {
        return middleLineY
    }
    
    func xVerticalLines() -> [CGFloat] {
        return verticalLinesX
    }
    
    func timesOnBottom() -> [Date] {
        return verticalTimes
    }
    
    func firstTime() -> Date? {
        return _lineData.first?.time
    }
    
    func lastTime() -> Date? {
        return _lineData.last?.time
    }
    
    func isPrivate() -> Bool {
        return _chartSetting["private"] as! Bool
    }
    
    override func rightPadding() ->CGFloat {
        return 50
    }
}
