//
//  LineChartDataSource.swift
//  TH_CFD
//
//  Created by william on 16/9/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

protocol LineChartDataProvider: BaseDataProvider
{
    func findHighlightPoint() -> CGPoint
    func showPreCloseLine() -> Bool
    func pointData() -> [CGPoint]
    func yPosOfMiddleLine() ->CGFloat
    func xVerticalLines() -> [CGFloat]
    func timesOnBottom() -> [Date]
    func firstTime() -> Date?
    func lastTime() -> Date?
    func lastPrice() -> Double?
}

class LineData: BaseData {
    var price: Double = 0
    
    override init(dict:NSDictionary) {
        super.init(dict: dict)
        price = (dict["p"] as? Double)!
    }
}

class LineChartDataSource: BaseDataSource, LineChartDataProvider {
    var _lineData = [LineData]()
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
                        let lineData:LineData = LineData.init(dict: chartDict as! NSDictionary)
                        _lineData.append(lineData)
                    }
                }
                if _jsonString.range(of: "preClose") != nil {
                    self.stockData = StockData()
                    self.stockData?.initWithDictionay(jsonDict)
                }
            }
        }
        catch {
            print("error serializing JSON: \(error)")
        }
    }
    
    override func setChartType(_ newValue:String) {
        if ["today", "2h", "week", "month", "3month", "6month"].contains(newValue) {
            super.setChartType(newValue)
            drawPreCloseLine = newValue == "today"
        }
    }
    
    static func isValidData(_ json:String) -> Bool {
        return json.contains("p")
    }
    
    override func isEmpty() -> Bool {
        return _lineData.isEmpty
    }
    
    override func calculateData(_ rect:CGRect) {
        if _chartType == "undefined" {
            return
        }
        _rect = rect
        if (_rect == CGRect.zero || _lineData.isEmpty) {
            return
        }
        let outWidth = maxPanX()
        let width = chartWidth() + outWidth
        let height = chartHeight()
//        print ("portrait:", AppDelegate.isPortrait())
//        print ("width: ", width, "height: ", height)
        
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
        
        let preClose = self.stockData?.last //self.stockData?.preClose
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
            var x:CGFloat = CGFloat(column) * spacer + self.pannedX() - outWidth
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
            }
            y = graphHeight + topBorder - y // Flip the graph
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
        // 固定显示4个时间
        let width = chartWidth()-2*_margin
        let outWidth = maxPanX()
        verticalLinesX = [_margin, _margin+width/3, _margin+width*2/3, _margin+width]
        verticalTimes = []
        for x in verticalLinesX {
            let realx = x - _margin
            var i = Int((realx+outWidth-pannedX()) / (width+outWidth) * CGFloat(_lineData.count))
            if i >= _lineData.count {
                i = _lineData.count - 1
            }
            if i < 0 {
                i = 0
            }
            verticalTimes.append(self._lineData[i].time!)
        }
        
//        if let time0 = _lineData.first?.time {
//            var startTime = stockData?.lastOpen ?? Date()
//            for i in 0 ..< _lineData.count {
//                if let time = _lineData[i].time {
//                    let interval:TimeInterval = time.timeIntervalSince(startTime)
//                    if interval > gap*0.99 {
//                        verticalLinesX.append(_pointData[i].x+0.5)
//                        startTime = time
//                        verticalTimes.append(self._lineData[i].time!)
//                    }
//                }
//            }
//        }
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
    
    func lastPrice() -> Double? {
        return self.stockData?.last
    }
    
    override func rightPadding() ->CGFloat {
        return 0
    }
    
}
